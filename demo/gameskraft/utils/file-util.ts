import * as fs from 'fs';

export class FileUtil {

    public static async readJsonFile(filename: string){
        try {
          const data = await fs.readFileSync(filename, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          return [];
        }
      }
}