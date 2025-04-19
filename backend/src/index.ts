import { Elysia } from "elysia";
import { bookRoutes } from "./routes/bookRoutes";
import { noteRoutes } from "./routes/noteRoutes";
import { connectDB } from "./db/connectDb";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia();
connectDB();

app.use(cors());
app.use(swagger());

app.group("/api", (app) => 
    app
        .use(bookRoutes)
        .use(noteRoutes));

app.listen(process.env.PORT || 3000);
