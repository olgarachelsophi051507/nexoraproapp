import express from 'express';
import next from 'next';

import setupSitemapAndRobots from './setupSitemapAndRobots';
import routesWithCache from './routesWithCache';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000; // Aseguramos que use el puerto 3000

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Permitir Next.js manejar sus propias rutas
  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });

  server.use(express.json());

  if (!dev) {
    server.set('trust proxy', 1);
  }

  // Ruta principal, redirige a login o dashboard según el usuario
  server.get('/', async (req: any, res) => {
    let redirectUrl = 'login';

    if (req.user) {
      redirectUrl = req.user.defaultTeamSlug
        ? `team/${req.user.defaultTeamSlug}/discussions`
        : 'create-team';
    }

    res.redirect(`${process.env.NEXT_PUBLIC_URL_APP || `http://localhost:${port}`}/${redirectUrl}`);
  });

  // Definir rutas del frontend con Next.js
  server.get('/teams/:teamSlug/your-settings', (req, res) => {
    const { teamSlug } = req.params;
    app.render(req, res, '/your-settings', { teamSlug });
  });

  server.get('/teams/:teamSlug/team-settings', (req, res) => {
    const { teamSlug } = req.params;
    app.render(req, res, '/team-settings', { teamSlug });
  });

  server.get('/teams/:teamSlug/billing', (req, res) => {
    const { teamSlug } = req.params;
    app.render(req, res, '/billing', { teamSlug, ...(req.query || {}) });
  });

  server.get('/teams/:teamSlug/discussions/:discussionSlug', (req, res) => {
    const { teamSlug, discussionSlug } = req.params;
    app.render(req, res, '/discussion', { teamSlug, discussionSlug });
  });

  server.get('/teams/:teamSlug/discussions', (req, res) => {
    const { teamSlug } = req.params;
    app.render(req, res, '/discussion', { teamSlug });
  });

  server.get('/signup', (req, res) => {
    app.render(req, res, '/login');
  });

  server.get('/invitation', (req, res) => {
    app.render(req, res, '/invitation', { token: req.query.token as string });
  });

  // Sitemap y cache
  setupSitemapAndRobots({ server });
  routesWithCache({ server, app });

  // Manejar todas las demás rutas con Next.js
  server.get('*', (req, res) => {
    handle(req, res);
  });

  // Iniciar el servidor
  server.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  });
});
