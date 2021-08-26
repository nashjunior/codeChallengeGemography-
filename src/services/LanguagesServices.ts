import api from 'config/api';
import { format, isDate, parseISO } from 'date-fns';
import { AxiosError } from 'axios';
import { IRepositories } from '../interfaces/IRepositories';
import AppError from '../errors/AppError';

type ILanguageReturn = {
  [language: string]: {
    qtd: number;
    repos: string[];
  };
};

class LanguagesService {
  async fetchRepositories(dateSearch: string): Promise<any> {
    const sanitazedDate = parseISO(dateSearch);

    if (!isDate(sanitazedDate)) throw new AppError('Invalid Date');
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

      const reposPerLanguage = items.reduce<ILanguageReturn>(
        (customReturn, item) => {

          /**
           * 1) check if language exists in object
           * 2) If not exists return the language as object key 
           *    containing the repo and quantity
          */
          if (!customReturn[item.language]) {
            return {
              ...customReturn,
              [item.language]: {
                qtd: 1,
                repos: [item.html_url],
              },
            };
          }


          /**
           * 3) Else return all previous languages, and the current language 
           *    increments the repo and quantity by one
          */

          return {
            ...customReturn,
            [item.language]: {
              qtd: customReturn[item.language].qtd + 1,
              repos: [...customReturn[item.language].repos, item.html_url],
            },
          };
        },
        {} as ILanguageReturn,
      );

      return reposPerLanguage;
    } catch (error) {
      if ((error as AxiosError).isAxiosError)
        throw new AppError((error as AxiosError).response?.data);

      throw new AppError(error);
    }
  }
}

export default LanguagesService;
