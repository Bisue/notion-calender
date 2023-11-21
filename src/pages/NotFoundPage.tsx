import { Link } from 'react-router-dom';
import type { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFoundPage;
