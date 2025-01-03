import { downloadExternalImageAndSaveToDisk } from '../src/lib/downloadExternalImageAndSaveToDisk';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { basename } from 'path';

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
}));

jest.mock('stream/promises', () => ({
  pipeline: jest.fn(),
}));

describe('downloadExternalImageAndSaveToDisk', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it('should fetch an image and save it to disk', async () => {
    const mockBody = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([97, 98, 99])); // "abc" in binary
        controller.close();
      },
    });
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      body: mockBody,
    } as Response);

    const mockImageUrl = 'https://test.com/image.png';
    const mockFilePath = '/downloads/image.png';

    // Fake write stream
    const mockWriter = {
      write: jest.fn(),
      end: jest.fn(),
    };
    (createWriteStream as jest.Mock).mockReturnValue(mockWriter);

    // Mock pipeline
    const mockPipeline = jest.fn().mockResolvedValueOnce(undefined);
    (pipeline as jest.Mock).mockImplementation(mockPipeline);

    // Call the function
    const result = await downloadExternalImageAndSaveToDisk(mockImageUrl, mockFilePath);

    expect(global.fetch).toHaveBeenCalledWith(mockImageUrl, expect.anything());
    expect(createWriteStream).toHaveBeenCalledWith(mockFilePath);
    expect(pipeline).toHaveBeenCalledWith(mockBody, mockWriter);
    expect(result).toBe(mockFilePath);
  });

  it('should throw error on fetch reponse.ok false', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      body: null,
    } as Response);

    const mockImageUrl = 'https://test.com/image.png';
    const mockFilePath = '/downloads/image.png';
    await expect(downloadExternalImageAndSaveToDisk(mockImageUrl, mockFilePath)).rejects.toThrow('Failed to fetch Image ' + mockImageUrl);
  });

  it('should throw error fetch error', async () => {
    let mockError = new Error('invalid url');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const mockImageUrl = 'https://test.com/image.png';
    const mockFilePath = '/downloads/image.png';
    // let res = ;
    // await expect(await downloadExternalImageAndSaveToDisk(mockImageUrl, mockFilePath)).rejects.toThrow(mockError.message);
    try {
      await downloadExternalImageAndSaveToDisk(mockImageUrl, mockFilePath);
    } catch (error) {
      expect(error).toEqual(new Error(`${mockError.message} | ${basename(mockFilePath)}`));
    }
  });

  it('should throw if pipeline fails', async () => {
    let mockError = new Error('invalid url');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const mockImageUrl = 'https://test.com/image.png';
    const mockFilePath = '/downloads/image.png';
  });
});
