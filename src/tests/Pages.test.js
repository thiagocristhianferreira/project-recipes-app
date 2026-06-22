import React from 'react';
import { screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

const RECIPE_CARD = '0-recipe-card';
const EXPLORE_COMIDAS = '/explorar/comidas';

const esperaCard = () => wait(() => {
  expect(screen.getByTestId(RECIPE_CARD)).toBeInTheDocument();
});

describe('Tela principal de Comidas', () => {
  it('carrega os cards e os botões de categoria', async () => {
    renderWithRouter(<App />, ['/comidas']);
    await esperaCard();
    expect(screen.getByTestId('Beef-category-filter')).toBeInTheDocument();
  });

  it('filtra por categoria e faz toggle ao clicar de novo', async () => {
    renderWithRouter(<App />, ['/comidas']);
    const beefBtn = await screen.findByTestId('Beef-category-filter');

    userEvent.click(beefBtn);
    await esperaCard();

    userEvent.click(beefBtn);
    await esperaCard();
  });

  it('navega para os detalhes ao clicar em um card', async () => {
    const { history } = renderWithRouter(<App />, ['/comidas']);
    const card = await screen.findByTestId(RECIPE_CARD);
    userEvent.click(card);
    await wait(() => {
      expect(history.location.pathname).toMatch(/\/comidas\/\d+/);
    });
  });
});

describe('Tela principal de Bebidas', () => {
  it('carrega os cards e filtra por categoria', async () => {
    renderWithRouter(<App />, ['/bebidas']);
    const cocktailBtn = await screen.findByTestId('Cocktail-category-filter');
    userEvent.click(cocktailBtn);
    await esperaCard();
  });
});

describe('Tela de Explorar Comidas/Bebidas', () => {
  it('botão "Por Ingredientes" leva para a tela de ingredientes', async () => {
    const { history } = renderWithRouter(<App />, [EXPLORE_COMIDAS]);
    userEvent.click(await screen.findByTestId('explore-by-ingredient'));
    expect(history.location.pathname).toBe(`${EXPLORE_COMIDAS}/ingredientes`);
  });

  it('botão "Por Local de Origem" leva para a tela de área', async () => {
    const { history } = renderWithRouter(<App />, [EXPLORE_COMIDAS]);
    userEvent.click(await screen.findByTestId('explore-by-area'));
    expect(history.location.pathname).toBe(`${EXPLORE_COMIDAS}/area`);
  });

  it('botão "Me Surpreenda!" leva para os detalhes de uma receita', async () => {
    const { history } = renderWithRouter(<App />, [EXPLORE_COMIDAS]);
    const btn = await screen.findByTestId('explore-surprise');
    await wait(() => {
      userEvent.click(btn);
      expect(history.location.pathname).toMatch(/\/comidas\/\d+/);
    });
  });

  it('tela de explorar bebidas não mostra o botão de origem', async () => {
    renderWithRouter(<App />, ['/explorar/bebidas']);
    await screen.findByTestId('explore-by-ingredient');
    expect(screen.queryByTestId('explore-by-area')).not.toBeInTheDocument();
  });
});

describe('Telas de Explorar por Origem e Ingredientes', () => {
  it('mostra o dropdown e filtra ao selecionar uma área', async () => {
    renderWithRouter(<App />, [`${EXPLORE_COMIDAS}/area`]);
    const dropdown = await screen.findByTestId('explore-by-area-dropdown');
    expect(dropdown).toBeInTheDocument();

    userEvent.selectOptions(dropdown, 'Japanese');
    await esperaCard();
  });

  it('ao clicar em um ingrediente vai para a tela de comidas', async () => {
    const { history } = renderWithRouter(<App />, [`${EXPLORE_COMIDAS}/ingredientes`]);
    const card = await screen.findByTestId('0-ingredient-card');
    userEvent.click(card);
    expect(history.location.pathname).toBe('/comidas');
  });
});
