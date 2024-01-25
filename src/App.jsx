import performScrapping from "./useFetchBooks";
import { useState, useEffect } from "react";
import cheerio from "cheerio";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default function App() {
  const [page, setPage] = useState(1);
  const { content, loading, error } = performScrapping(page);
  const [books, setBooks] = useState([]);
  const BASE_URL = "https://books.toscrape.com/";

  useEffect(() => {
    const $ = cheerio.load(content);

    const books = [];

    $(".product_pod").each((_, element) => {
      const title = $(element).find("h3 > a").attr("title");
      const price = $(element).find(".price_color").text();
      const image = $(element).find("a > img").attr("src");
      const imageURL =
        "https://corsproxy.io/?" + encodeURIComponent(BASE_URL + image);

      books.push({
        title,
        price,
        imageURL,
      });
    });

    setBooks(books);
    setPage(1);
  }, [content, BASE_URL]);

  return (
    <Container maxWidth="lg" sx={{ maxWidth: 600, width: "100%", mx: "auto" }}>
      <Typography textAlign={"center"} variant="h2" color="secondary">
        Books
      </Typography>
      {loading && (
        <Typography variant="h3" color="secondary">
          Loading...
        </Typography>
      )}
      {error && (
        <Typography variant="h3" color="secondary">
          Error...
        </Typography>
      )}
      <Container>
        {books.length > 0 &&
          books.map((book, index) => (
            <Card key={index} sx={{ mt: 2 }}>
              <CardHeader
                title={book.title}
                subheader={book.price}
                sx={{ mx: "auto", textAlign: "center" }}
              />
              <CardMedia
                component={"img"}
                image={book.imageURL}
                sx={{ maxWidth: "50%", mx: "auto", mb: 2 }}
              />
            </Card>
          ))}
      </Container>
    </Container>
  );
}
