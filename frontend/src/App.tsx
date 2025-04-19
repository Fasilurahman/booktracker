import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./pages/HomePage";
import { BooksPage } from "./pages/BooksPage";
import { BookDetailsPage } from "./pages/BookDetailsPage";

function App() {
  return (
    <Router>
      <div className=" bg-gray-50">
          <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
