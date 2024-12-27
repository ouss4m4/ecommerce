import { AppDataSource } from '../db';
import { Category } from '../entities/category.entity';
import { createSlug } from '../lib/createSlug';

export class CategoryController {
  static async getCategories() {
    const categoryRepo = AppDataSource.getRepository(Category);

    return await categoryRepo.find();
  }

  static async createCategory(unsafeData: any) {
    // validation with joi
    const { name } = unsafeData;
    if (!name) {
      throw new Error('missing fields');
    }
    let slug = createSlug(name);
    const categoryRepo = AppDataSource.getRepository(Category);

    let category = await categoryRepo.insert({
      name,
      slug,
    });

    return category;
  }
}
