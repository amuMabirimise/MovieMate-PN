import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigation } from "expo-router";

const TMDB_API_KEY = "5138aa4ab2cae3c208f8a6aa6afe4e63"; // Replace with your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3/";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movie data from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      let allMovies = [];
      try {
        for (let page = 1; page <= 4; page++) {
          const response = await axios.get(`${BASE_URL}movie/popular`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "en-US",
              page: page,
            },
          });
          allMovies = [...allMovies, ...response.data.results];
        }
        const sortedMovies = allMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        const limitedMovies = sortedMovies.slice(0, 80); // Limit to 80 movies
        setMovies(limitedMovies);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };

    const fetchLatestMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}movie/latest`, {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
          },
        });
        setLatestMovies([response.data]); // Latest movie is a single object
        setLoading(false);
      } catch (error) {
        console.error("Error fetching latest movie:", error);
      }
    };

    fetchMovies();
    fetchLatestMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.mainContainer}>
        <Text style={styles.welcomeText}>Welcome to MovieMate 🎬</Text>

        {/* Movie Selection Section */}
        <View style={styles.movieSection}>
          <Text style={styles.sectionTitle}>Choose a Movie:</Text>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("details", { movie: item })} // ✅ Navigate to details page
                style={styles.movieCard}
              >
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.moviePoster}
                />
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.movieReleaseDate}>{item.release_date}</Text>
              </TouchableOpacity>
            )}
            numColumns={2} // Display in 2 columns
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Latest Movies Section */}
        <View style={styles.latestSection}>
          <Text style={styles.sectionTitle}>Latest Movie:</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("details", { movie: latestMovies[0] })
            } // ✅ Navigate to details page
            style={styles.movieCard}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${latestMovies[0].poster_path}`,
              }}
              style={styles.moviePoster}
            />
            <Text style={styles.movieTitle}>{latestMovies[0].title}</Text>
            <Text style={styles.movieReleaseDate}>
              {latestMovies[0].release_date}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#778899",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  movieSection: {
    marginBottom: 30,
  },
  latestSection: {
    marginBottom: 30,
  },
  movieCard: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5, // Space between columns
  },
  moviePoster: {
    width: width / 2 - 20, // Adjust width based on screen size
    height: 225,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  movieReleaseDate: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
