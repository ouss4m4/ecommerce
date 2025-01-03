import { AppDataSource } from '../src/db';
import { downloadExternalImageAndSaveToDisk } from '../src/lib/downloadExternalImageAndSaveToDisk';
import { fetchImageAndInsertInDbAsync } from '../src/lib/fetchImageAndInsertInDbAsync';

jest.mock('../src/db');
jest.mock('../src/lib/downloadExternalImageAndSaveToDisk');

describe('fetchImageAndInsertInDbAsync', () => {
  let mockRepository: jest.Mocked<ReturnType<typeof AppDataSource.getRepository>>;
  const sku = 'IT002';
  const name = 'phone';
  const description = 'lorem ipsum dolor sit amet';
  const categoryId = 1;
  const price = 123;
  const imageUrl = 'wrongurl';
  const mockError = new Error('failed to fetch');

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock the repository
    mockRepository = {
      upsert: jest.fn(),
    } as any;

    // Mock `AppDataSource.getRepository`
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  it('download an image and insert product in db', async () => {
    // mock external function (tested in dedicated file);
    (downloadExternalImageAndSaveToDisk as jest.Mock).mockResolvedValue('success');

    const result = await fetchImageAndInsertInDbAsync(sku, name, description, categoryId, price, imageUrl);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledTimes(1);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledWith(imageUrl, expect.anything());
    expect(mockRepository.upsert).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should error on wrong failed image fetch', async () => {
    const mockError = new Error('failed to fetch');
    (downloadExternalImageAndSaveToDisk as jest.Mock).mockRejectedValue(mockError);
    const result = await fetchImageAndInsertInDbAsync(sku, name, description, categoryId, price, imageUrl);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledTimes(1);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledWith(imageUrl, expect.anything());
    expect(downloadExternalImageAndSaveToDisk).rejects.toThrow('failed to fetch');
    expect(mockRepository.upsert).not.toHaveBeenCalled();
    expect(result).toStrictEqual(mockError);
  });

  it('Should throw on upsert error', async () => {
    const mockError = new Error('foreign key fail');
    (downloadExternalImageAndSaveToDisk as jest.Mock).mockResolvedValue('abc');
    (mockRepository.upsert as jest.Mock).mockRejectedValue(mockError);

    const result = await fetchImageAndInsertInDbAsync(sku, name, description, categoryId, price, imageUrl);

    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledTimes(1);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledWith(imageUrl, expect.anything());
    expect(mockRepository.upsert).toHaveBeenCalledTimes(1);
    expect(mockRepository.upsert).rejects.toThrow('foreign key fail');
    expect(result).toEqual(mockError);
  });
});
