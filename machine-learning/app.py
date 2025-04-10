from flask import Flask, request, jsonify
from flask_cors import CORS
import IntexPipeline  # <-- good import
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

df = pd.read_csv('movies_titles.csv')
df = df.replace({np.nan: None})
all_movies = df.to_dict(orient='records')

@app.route('/recommend/content', methods=['GET'])
def recommend_content():
    user_id = int(request.args.get('user_id'))
    top_n = int(request.args.get('top_n', 10))
    result = IntexPipeline.content_based_recommendation(user_id, top_n)
    result = result.rename(columns={
    'release_year': 'releaseYear'
})
    return jsonify(result.to_dict(orient='records'))  

@app.route('/recommend/collaborative', methods=['GET'])
def recommend_collaborative():
    user_id = int(request.args.get('user_id'))
    top_n = int(request.args.get('top_n', 10))
    result = IntexPipeline.collaborative_filtering_recommendation(user_id, top_n)
    result = result.rename(columns={
    'release_year': 'releaseYear'
})
    return jsonify(result.to_dict(orient='records'))

@app.route('/recommend/hybrid', methods=['GET'])
def recommend_hybrid():
    user_id = int(request.args.get('user_id'))
    top_n = int(request.args.get('top_n', 10))
    result = IntexPipeline.hybrid_recommendation(user_id, top_n)
    result = result.rename(columns={
    'release_year': 'releaseYear'
})
    return jsonify(result.to_dict(orient='records'))

@app.route('/recommend/movie-to-movie', methods=['GET'])
def recommend_movie_to_movie():
    movie_title = request.args.get('movie_title')
    top_n = int(request.args.get('top_n', 10))
    result = IntexPipeline.movie_to_movie_recommendation(movie_title, top_n)
    result = result.rename(columns={
    'release_year': 'releaseYear'
})
    return jsonify(result.to_dict(orient='records'))

@app.route('/recommend/hidden-gems', methods=['GET'])
def recommend_hidden_gems():
    result = IntexPipeline.find_hidden_gems(
        IntexPipeline.ratings,
        IntexPipeline.movies
    )
    result = result.rename(columns={
    'release_year': 'releaseYear'
})
    return jsonify(result.to_dict(orient='records'))  # Convert DataFrame to JSON

@app.route('/genre-based', methods=['GET'])
def recommend_genre_based():
    genre = request.args.get('genre')
    print("Genre requested:", genre)

    if not genre:
        return jsonify([])

    # ⚡ NEW: Call your recommender function
    recommended_movies = IntexPipeline.genre_based_recommendations_all_movies(
        IntexPipeline.ratings,  # Assuming you imported these
        IntexPipeline.movies
    )

    # Now filter the recommended_movies by genre
    filtered_movies = []
    for _, movie in recommended_movies.iterrows():
        if genre in movie and str(movie[genre]).strip() == "1":
            filtered_movies.append(movie.to_dict())

    print(f"Movies found for {genre}: {len(filtered_movies)}")
    return jsonify(filtered_movies)



if __name__ == '__main__':
    app.run()
