// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

const fetchMock = require('../cypress/mocks/fetch');

// Mock global de fetch usando as fixtures do Cypress, para que os testes
// não dependam de rede real (evita crashes de worker e testes instáveis).
beforeEach(() => {
  global.fetch = jest.fn(fetchMock);
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// O jsdom não implementa a Clipboard API; a lib clipboard-copy lança erro
// ao tentar copiar. Fornecemos um stub para os botões de compartilhar.
Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
});
