import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;
