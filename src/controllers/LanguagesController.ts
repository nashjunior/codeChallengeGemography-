import { subMonths } from 'date-fns';
import { Request, Response } from 'express';
import LanguagesService from '../services/LanguagesServices';

class LanguagesController {
  async index(request: Request, response: Response): Promise<Response> {
    const languagesService = new LanguagesService();

    const result = await languagesService.fetchRepositories(
      subMonths(new Date(), 1).toISOString(),
    );
    return response.status(200).json(result);
  }
}

export default LanguagesController;
