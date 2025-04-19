import { Elysia } from "elysia";
import { bookRoutes } from "./routes/bookRoutes";
import { noteRoutes } from "./routes/noteRoutes";
import { connectDB } from "./db/connectDb";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia();
connectDB();

app.use(cors({
    origin: ["http://localhost:5173"],
}));
app.use(swagger({
    documentation: {
        info: {
            title: "Books & Notes API",
            version: "1.0.0",
            description: "API documentation for managing books and their notes."
        }
    }
}));


app.group("/api", (app) => 
    app
        .use(bookRoutes)
        .use(noteRoutes));

app.listen(process.env.PORT || 3000);
