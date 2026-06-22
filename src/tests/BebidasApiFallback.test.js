import { getAllBebida } from '../services/BuscaNasAPIs';

const ID_BEBIDA = '178319';

describe('BuscaNasAPIs - fallback de bebidas', () => {
  it('usa fallback quando listagem inicial nao retorna array', async () => {
    global.fetch = jest.fn((url) => Promise.resolve({
      json: () => Promise.resolve(
        url.includes('search.php?s=')
          ? { drinks: 'no data found' }
          : { drinks: [{ idDrink: ID_BEBIDA }] },
      ),
    }));

    expect((await getAllBebida()).drinks).toEqual([{ idDrink: ID_BEBIDA }]);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a',
    );
  });
});
