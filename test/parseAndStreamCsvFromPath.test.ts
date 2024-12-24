import { Readable } from 'stream';
import { parseAndStreamCsvFromPath } from '../src/lib/parseAndStreamCsvFromPath';
import { createReadStream } from 'fs';

jest.mock('fs', () => ({
  createReadStream: jest.fn(),
}));

describe('parseAndStreamCsvFromPath', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should read csv from disk and return stream', async () => {
    let mockFilepath = '/uploads/test.csv';

    // Mock a CSV file with a single line of data
    const mockCsv = `name,description,category,price,image\niphone,some phone,phone,123,http://sample.com`;
    const mockStream = new Readable({
      read() {
        this.push(mockCsv);
        this.push(null);
      },
    });

    (createReadStream as jest.Mock).mockReturnValue(mockStream);

    // call function and expect first row to be correct;
    const result = parseAndStreamCsvFromPath(mockFilepath);

    expect(createReadStream).toHaveBeenCalledWith(mockFilepath);
    for await (const row of result) {
      expect(row).toEqual({ category: 'phone', description: 'some phone', image: 'http://sample.com', name: 'iphone', price: '123' });
    }
  });

  //   it('Should handle stream errors', async () => {
  //     const mockFilepath = '/uploads/test.csv';
  //     const mockStream = new Readable({
  //       read() {
  //         this.emit('error', new Error('Stream error'));
  //       },
  //     });

  //     (createReadStream as jest.Mock).mockReturnValue(mockStream);

  //     expect(parseAndStreamCsvFromPath(mockFilepath)).toHaveBeenCalled();
  //   });
});
