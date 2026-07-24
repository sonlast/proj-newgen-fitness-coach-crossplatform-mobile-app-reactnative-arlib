import { render } from '@testing-library/react-native';
import IndexScreen from '../app/index';

describe('<IndexScreen />', () => {
  test('Text render correctly on IndexScreen', () => {
    const { getByText } = render(<IndexScreen/>);

    getByText('Search Manually.');
  })
})
