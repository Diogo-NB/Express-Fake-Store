import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import rootDir from './util/path'

import { router as adminRoutes } from './routes/admin';
import { router as shopRoutes } from './routes/shop';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(rootDir, 'public'))); /// Users can access public files

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use((req, res, next) => {
    res.render('404', { pageTitle: 'Page not found!', path: '404' });
    // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
})

// Create a local server to receive data from
app.listen(3000);