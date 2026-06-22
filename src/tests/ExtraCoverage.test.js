import React from 'react';
import { screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import ReceitasFeitas from '../pages/ReceitasFeitas';
import ReceitasFavoritas from '../pages/ReceitasFavoritas';
import App from '../App';

const NOME_TESTID = '4-horizontal-name';

const muitasReceitas = (type) => Array.from({ length: 5 }, (_, i) => ({
  id: String(i),
  type: i % 2 === 0 ? 'comida' : 'bebida',
  area: 'Italian',
  category: 'Vegetarian',
  alcoholicOrNot: i % 2 === 0 ? '' : 'Alcoholic',
  name: `${type} ${i}`,
  image: 'img',
  doneDate: '23/06/2020',
  tags: [],
}));

describe('Telas de listagem com muitas receitas (altura alternativa)', () => {
  it('Receitas Feitas renderiza com 4+ receitas', () => {
    localStorage.setItem('doneRecipes', JSON.stringify(muitasReceitas('feita')));
    renderWithRouter(<ReceitasFeitas />);
    expect(screen.getByTestId(NOME_TESTID)).toBeInTheDocument();
  });

  it('Receitas Favoritas renderiza com 4+ receitas', () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(muitasReceitas('fav')));
    renderWithRouter(<ReceitasFavoritas />);
    expect(screen.getByTestId(NOME_TESTID)).toBeInTheDocument();
  });
});

describe('Explorar por Local de Origem - opção All', () => {
  it('seleciona a opção All no dropdown', async () => {
    renderWithRouter(<App />, ['/explorar/comidas/area']);
    const dropdown = await screen.findByTestId('explore-by-area-dropdown');
    userEvent.selectOptions(dropdown, 'All');
    await wait(() => {
      expect(screen.getByTestId('0-recipe-card')).toBeInTheDocument();
    });
  });
});
