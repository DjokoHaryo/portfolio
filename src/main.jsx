import React from 'react';
import ReactDOM from 'react-dom/client';
import Lanyard from './components/Lanyard/Lanyard';

const container = document.getElementById('lanyard-root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      {/* position=[0, 0, 20]: Camera at world center.
          With anchor at [0, 3.4, 0] and fov=20, the strap loop attaches seamlessly
          right beneath the navbar, and the card hangs centered and fully visible
          within screen boundaries without clipping or 0px canvas issues. */}
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={10} anchor={[2, 4, 0]} />
    </React.StrictMode>
  );
}
