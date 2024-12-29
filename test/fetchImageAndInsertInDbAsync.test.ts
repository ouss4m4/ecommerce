import { AppDataSource } from '../src/db';
import { downloadExternalImageAndSaveToDisk } from '../src/lib/downloadExternalImageAndSaveToDisk';
import { fetchImageAndInsertInDbAsync } from '../src/lib/fetchImageAndInsertInDbAsync';

jest.mock('../src/db');
jest.mock('../src/lib/downloadExternalImageAndSaveToDisk');

describe('fetchImageAndInsertInDbAsync', () => {
  let mockRepository: jest.Mocked<ReturnType<typeof AppDataSource.getRepository>>;

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock the repository
    mockRepository = {
      insert: jest.fn(),
    } as any;

    // Mock `AppDataSource.getRepository`
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  it('download an image and insert product in db', async () => {
    let { sku, name, description, categoryId, price, imageUrl } = {
      sku: 'IT001',
      name: 'samsung',
      description: 'lorem ipsum dolor sit amet',
      categoryId: 1,
      price: 123,
      imageUrl: 'test.com',
    };

    (downloadExternalImageAndSaveToDisk as jest.Mock).mockResolvedValue('abc');
    await fetchImageAndInsertInDbAsync(sku, name, description, categoryId, price, imageUrl);

    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledTimes(1);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledWith(imageUrl, expect.anything());
    expect(mockRepository.insert).toHaveBeenCalledTimes(1);
    expect(mockRepository.insert).toHaveBeenCalledWith({
      sku,
      name,
      description,
      categoryId,
      price,
      image: `\\images\\${sku}.png`,
    });
  });

  it('should error on wrong failed image fetch', async () => {
    const sku = 'IT002';
    const name = 'phone';
    const description = 'lorem ipsum dolor sit amet';
    const categoryId = 1;
    const price = 123;
    const imageUrl = 'wrongurl';

    (downloadExternalImageAndSaveToDisk as jest.Mock).mockRejectedValue(new Error('failed to fetch'));
    await fetchImageAndInsertInDbAsync(sku, name, description, categoryId, price, imageUrl);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledTimes(1);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledWith(imageUrl, expect.anything());
    expect(downloadExternalImageAndSaveToDisk).rejects.toThrow('failed to fetch');
    expect(mockRepository.insert).not.toHaveBeenCalled();
  });

  it('should throw on duplicate insert', async () => {
    let { sku, name, description, categoryId, price, imageUrl } = {
      sku: 'IT001',
      name: 'samsung',
      description: 'lorem ipsum dolor sit amet',
      categoryId: 1,
      price: 123,
      imageUrl: 'test.com',
    };

    (downloadExternalImageAndSaveToDisk as jest.Mock).mockResolvedValue('abc');
    (mockRepository.insert as jest.Mock).mockRejectedValue(new Error('duplicate row'));

    await fetchImageAndInsertInDbAsync(sku, name, description, categoryId, price, imageUrl);

    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledTimes(1);
    expect(downloadExternalImageAndSaveToDisk).toHaveBeenCalledWith(imageUrl, expect.anything());
    expect(mockRepository.insert).toHaveBeenCalledTimes(1);
    expect(mockRepository.insert).toHaveBeenCalledWith({
      sku,
      name,
      description,
      categoryId,
      price,
      image: `\\images\\${sku}.png`,
    });

    expect(mockRepository.insert).rejects.toThrow('duplicate row');
  });
});
