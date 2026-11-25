import './index.css'

import { createFileBasedRouter } from "ziko/router";
const pages = import.meta.glob('./pages/**/*.js')
const app = createFileBasedRouter(
    {
        pages,
        target : document.body,
    }
)