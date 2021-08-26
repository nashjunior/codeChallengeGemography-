import api from 'config/api';
import { format, isDate, parseISO } from 'date-fns';
import { AxiosError } from 'axios';
import { IRepositories } from '../interfaces/IRepositories';
import AppError from '../errors/AppError';

type ILanguageReturn = {
  [language: string]: string[];
};

class LanguagesService {
  async fetchRepositories(dateSearch: string): Promise<any> {
    const sanitazedDate = parseISO(dateSearch);

    if (!isDate(sanitazedDate)) throw new AppError('Data inválida');
    try {
      const { data } = await api.get<IRepositories>('repositories', {
        params: {
          sort: 'stars',
          order: 'desc',
          q: `created:>${format(sanitazedDate, 'yyyy-MM-dd')}`,
          per_page: 100,
        },
      });

      const { items } = data;

      return items.reduce<ILanguageReturn>((customReturn, item) => {
        if (!customReturn[item.language]) {
          return {
            ...customReturn,
            [item.language]: [item.html_url],
          };
        }

        return {
          ...customReturn,
          [item.language]: [...customReturn[item.language], item.html_url],
        };
      }, {} as ILanguageReturn);
    } catch (error) {
      if ((error as AxiosError).isAxiosError)
        throw new AppError((error as AxiosError).response?.data);

      throw new AppError(error);
    }
  }
}

export default LanguagesService;
