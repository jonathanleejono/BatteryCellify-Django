// import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'simplebar/src/simplebar.css';
import Register from '../pages/Register';
import { render, screen } from '../test-utils';
// import { LoginForm } from '../sections/auth/login';

describe('Register user', () => {
  it('should allow a user to Register', async () => {
    const { getByRole, findByText } = render(
      <>
        <BrowserRouter>
          {/* <ToastContainer position="top-center" autoClose={2000} hideProgressBar transition={Slide} /> */}
          <Register />
        </BrowserRouter>
      </>
    );

    expect(await screen.findByText('Explore and analyze battery cell data.')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/First name/i), 'silas');
    await userEvent.type(screen.getByLabelText(/Last name/i), 'w2');
    // await userEvent.type(screen.getByLabelText(/Email address/i), 'silasw2@gmail.com');

    userEvent.click(screen.getByRole('button', { name: /Register/i }));

    const toastMessage = await getByRole('alert');

    // expect(await screen.findByText('Hello there silas')).toBeInTheDocument();
    expect(toastMessage).toHaveTextContent('Success Message');
    // expect(await screen.getByRole('alert')).toBeInTheDocument();
    // expect(await screen.findByText('Back')).toBeInTheDocument();
    // expect(await screen.findByText('silas')).toBeInTheDocument();
  });
});
