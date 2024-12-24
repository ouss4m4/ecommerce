import { downloadExternalImageAndSaveToDisk } from '../src/lib/downloadExternalImageAndSaveToDisk';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
}));

jest.mock('stream/promises', () => ({
  pipeline: jest.fn(),
}));

describe('downloadExternalImageAndSaveToDisk', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

    expect(global.fetch).toHaveBeenCalledWith(mockImageUrl);
    expect(createWriteStream).toHaveBeenCalledWith(mockFilePath);
    expect(pipeline).toHaveBeenCalledWith(mockBody, mockWriter);
    expect(result).toBe(mockFilePath);
  });

  it('should throw error on wrong url', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      body: null,
    } as Response);
    const mockImageUrl = 'https://test.com/image.png';
    const mockFilePath = '/downloads/image.png';
    await expect(downloadExternalImageAndSaveToDisk(mockImageUrl, mockFilePath)).rejects.toThrow('Failed to fetch Image ' + mockImageUrl);
  });
});
