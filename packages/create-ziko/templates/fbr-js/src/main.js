import './index.css'

import { createSPAFileBasedRouter } from "ziko/router";
const pages = import.meta.glob('./pages/**/*.js')
const app = createSPAFileBasedRouter(
    {
        pages,
        target : document.body,
    }
)