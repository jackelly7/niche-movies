import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

ratings = pd.read_csv("movies_ratings.csv")
users = pd.read_csv('movies_users.csv')
titles = pd.read_csv('movies_titles.csv')

# Preprocessing
titles['combined_features'] = titles['description'].fillna('')

# TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(titles['combined_features'])

# Content similarity matrix
content_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# User-item rating matrix
user_item_matrix = ratings.pivot_table(index='user_id', columns='show_id', values='rating')


# %%
titles = titles.dropna()

# %% [markdown]
# Content Filter

# %%
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Preprocessing
movies = titles.copy()
# Create a new "genre_string" column first
genre_keys = [
    "Action", "Adventure", "Anime Series International TV Shows", 
    "British TV Shows Docuseries International TV Shows", "Children", 
    "Comedies", "Comedies Dramas International Movies", 
    "Comedies International Movies", "Comedies Romantic Movies", 
    "Crime TV Shows Docuseries", "Documentaries", 
    "Documentaries International Movies", "Docuseries", "Dramas", 
    "Dramas International Movies", "Dramas Romantic Movies", 
    "Family Movies", "Fantasy", "Horror Movies", 
    "International Movies Thrillers", 
    "International TV Shows Romantic TV Shows TV Dramas", 
    "Kids' TV", "Language TV Shows", "Musicals", "Nature TV", 
    "Reality TV", "Spirituality", "TV Action", "TV Comedies", 
    "TV Dramas", "Talk Shows TV Comedies", "Thrillers"
]

def combine_genres(row):
    return " ".join([genre for genre in genre_keys if row.get(genre, 0) == 1])

# Apply it to every row
movies['genre_string'] = movies.apply(combine_genres, axis=1)

# Now build your combined features
movies['combined_features'] = (
    movies['title'].fillna('') + ' ' +
    movies['genre_string'].fillna('') + ' ' +
    movies['description'].fillna('') + ' ' +
    movies['cast'].fillna('') + ' ' +
    movies['director'].fillna('')
)

# TF-IDF Vectorizer on 'description'
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['combined_features'])

# Content similarity matrix
content_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# User-item rating matrix
user_item_matrix = ratings.pivot_table(index='user_id', columns='show_id', values='rating')

# 1. Content-Based Filtering

def content_based_recommendation(user_id, top_n=10):
    if user_id not in user_item_matrix.index:
        return [], "Unknown"

    user_ratings = user_item_matrix.loc[user_id]
    rated_show_ids = user_ratings.dropna().index.tolist()

    # 👇 Pick the highest-rated show (or just the first one)
    if rated_show_ids:
        based_on_show_id = rated_show_ids[0]
        based_on_movie_row = movies[movies['show_id'] == based_on_show_id]
        if not based_on_movie_row.empty:
            based_on_movie_title = based_on_movie_row.iloc[0]['title']
        else:
            based_on_movie_title = "Unknown"
    else:
        based_on_movie_title = "Unknown"

    content_scores = np.zeros(movies.shape[0])

    for show_id, rating in user_ratings.dropna().items():
        movie_idx_list = movies.index[movies['show_id'] == show_id].tolist()
        if movie_idx_list:
            movie_idx = movie_idx_list[0]
            if movie_idx < len(content_sim):
                content_scores += rating * content_sim[movie_idx]


    content_scores = content_scores / (len(rated_show_ids) + 1e-9)

    scores_df = pd.DataFrame({'show_id': movies['show_id'], 'score': content_scores})
    scores_df = scores_df.sort_values(by='score', ascending=False)

    recommended = movies[movies['show_id'].isin(scores_df['show_id']) & (~movies['show_id'].isin(rated_show_ids))]

    return recommended[['show_id', 'title', 'description', 'director', 'cast', 'release_year', 'rating', 'duration',
        'Action', 'Adventure', 'Anime Series International TV Shows', 'British TV Shows Docuseries International TV Shows',
        'Children', 'Comedies', 'Comedies Dramas International Movies', 'Comedies International Movies',
        'Comedies Romantic Movies', 'Crime TV Shows Docuseries', 'Documentaries',
        'Documentaries International Movies', 'Docuseries', 'Dramas', 'Dramas International Movies',
        'Dramas Romantic Movies', 'Family Movies', 'Fantasy', 'Horror Movies', 'International Movies Thrillers',
        'International TV Shows Romantic TV Shows TV Dramas', "Kids' TV", 'Language TV Shows', 'Musicals', 'Nature TV',
        'Reality TV', 'Spirituality', 'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
    ]].head(top_n).reset_index(drop=True), based_on_movie_title


# %% [markdown]
# Collaborative Filter

# %%
# 2. Collaborative Filtering

def collaborative_filtering_recommendation(user_id, top_n=10):
    if user_id not in user_item_matrix.index:
        return ["User not found."]

    user_sim = cosine_similarity(user_item_matrix.fillna(0))
    user_sim_scores = pd.Series(user_sim[user_item_matrix.index.get_loc(user_id)], index=user_item_matrix.index)
    similar_users = user_sim_scores.sort_values(ascending=False)[1:11]

    similar_users_ratings = user_item_matrix.loc[similar_users.index]
    collaborative_scores = similar_users_ratings.mean(axis=0)

    user_ratings = user_item_matrix.loc[user_id]
    rated_show_ids = user_ratings.dropna().index.tolist()

    collaborative_scores = collaborative_scores.drop(rated_show_ids, errors='ignore')
    scores_df = collaborative_scores.reset_index()
    scores_df.columns = ['show_id', 'score']

    recommended = movies[movies['show_id'].isin(scores_df['show_id'])]
    return recommended[['show_id', 'title', 'description', 'director', 'cast', 'release_year', 'rating', 'duration',
             'Action', 'Adventure', 'Anime Series International TV Shows', 'British TV Shows Docuseries International TV Shows',
             'Children', 'Comedies', 'Comedies Dramas International Movies', 'Comedies International Movies',
             'Comedies Romantic Movies', 'Crime TV Shows Docuseries', 'Documentaries',
             'Documentaries International Movies', 'Docuseries', 'Dramas', 'Dramas International Movies',
             'Dramas Romantic Movies', 'Family Movies', 'Fantasy', 'Horror Movies', 'International Movies Thrillers',
             'International TV Shows Romantic TV Shows TV Dramas', "Kids' TV", 'Language TV Shows', 'Musicals', 'Nature TV',
             'Reality TV', 'Spirituality', 'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
            ]].head(top_n).reset_index(drop=True)

# %% [markdown]
# Hybrid Filter

# %%
# 3. Hybrid Filtering

def hybrid_recommendation(user_id, top_n=10):
    if user_id not in user_item_matrix.index:
        return ["User not found."]

    # Content-based scores
    user_ratings = user_item_matrix.loc[user_id]
    rated_show_ids = user_ratings.dropna().index.tolist()

    content_scores = np.zeros(movies.shape[0])
    for show_id in rated_show_ids:
        movie_idx_list = movies.index[movies['show_id'] == show_id].tolist()
        if movie_idx_list:  # <--- this must be inside the loop!
            movie_idx = movie_idx_list[0]
            if movie_idx < len(content_sim):
                content_scores += content_sim[movie_idx]



    content_scores = content_scores / (len(rated_show_ids) + 1e-9)
    content_df = pd.DataFrame({'show_id': movies['show_id'], 'content_score': content_scores})

    # Collaborative scores
    user_sim = cosine_similarity(user_item_matrix.fillna(0))
    user_sim_scores = pd.Series(user_sim[user_item_matrix.index.get_loc(user_id)], index=user_item_matrix.index)
    similar_users = user_sim_scores.sort_values(ascending=False)[1:11]

    similar_users_ratings = user_item_matrix.loc[similar_users.index]
    collaborative_scores = similar_users_ratings.mean(axis=0)

    collaborative_scores = collaborative_scores.drop(rated_show_ids, errors='ignore')
    collaborative_df = collaborative_scores.reset_index()
    collaborative_df.columns = ['show_id', 'collab_score']

    # Merge and calculate hybrid score
    final_scores = pd.merge(content_df, collaborative_df, on='show_id', how='inner')
    final_scores['hybrid_score'] = final_scores['content_score'] * 0.5 + final_scores['collab_score'] * 0.5

    # Sort and merge with movie info properly
    recommended = final_scores.sort_values(by='hybrid_score', ascending=False)
    recommended_movies = pd.merge(recommended, movies, on='show_id')
    recommended_movies = recommended_movies.sort_values(by='hybrid_score', ascending=False)

    return recommended_movies[['show_id', 'title', 'description', 'director', 'cast', 'release_year', 'rating', 'duration',
             'Action', 'Adventure', 'Anime Series International TV Shows', 'British TV Shows Docuseries International TV Shows',
             'Children', 'Comedies', 'Comedies Dramas International Movies', 'Comedies International Movies',
             'Comedies Romantic Movies', 'Crime TV Shows Docuseries', 'Documentaries',
             'Documentaries International Movies', 'Docuseries', 'Dramas', 'Dramas International Movies',
             'Dramas Romantic Movies', 'Family Movies', 'Fantasy', 'Horror Movies', 'International Movies Thrillers',
             'International TV Shows Romantic TV Shows TV Dramas', "Kids' TV", 'Language TV Shows', 'Musicals', 'Nature TV',
             'Reality TV', 'Spirituality', 'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
            ]].head(top_n).reset_index(drop=True)


# %%
# 4. Movie-to-Movie Similarity Recommendation

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def movie_to_movie_recommendation(movie_title, top_n=10):
    # Find the movie
    movie_idx_list = movies.index[movies['title'] == movie_title].tolist()
    if not movie_idx_list:
        return ["Movie not found."]
    
    movie_idx = movie_idx_list[0]
    
    # Get type (Movie or TV Show)
    movie_type = movies.loc[movie_idx, 'type']
    
    # Only use numeric genre columns (0/1 values)
    genre_cols = movies.select_dtypes(include=[np.number]).columns.tolist()

    # (Optional: If some numeric columns sneak in that aren't genres, you might want to manually filter too.)
    
    movie_genre_vector = movies.loc[movie_idx, genre_cols].values.reshape(1, -1)

    # Filter movies with the same type
    same_type_movies = movies[movies['type'] == movie_type].copy()

    # Compute genre similarities
    genre_matrix = same_type_movies[genre_cols].values
    genre_sim = cosine_similarity(movie_genre_vector, genre_matrix).flatten()

    # Add similarity scores to the dataframe
    same_type_movies['genre_similarity'] = genre_sim

    # Sort by similarity
    recommendations = same_type_movies.sort_values(by='genre_similarity', ascending=False)

    # Drop the input movie itself
    recommendations = recommendations[recommendations['title'] != movie_title]

    # Pick top_n
    top_recommendations = recommendations.head(top_n)

    return top_recommendations[['show_id', 'title', 'description', 'director', 'cast', 'release_year', 'rating', 'duration',
             'Action', 'Adventure', 'Anime Series International TV Shows', 'British TV Shows Docuseries International TV Shows',
             'Children', 'Comedies', 'Comedies Dramas International Movies', 'Comedies International Movies',
             'Comedies Romantic Movies', 'Crime TV Shows Docuseries', 'Documentaries',
             'Documentaries International Movies', 'Docuseries', 'Dramas', 'Dramas International Movies',
             'Dramas Romantic Movies', 'Family Movies', 'Fantasy', 'Horror Movies', 'International Movies Thrillers',
             'International TV Shows Romantic TV Shows TV Dramas', "Kids' TV", 'Language TV Shows', 'Musicals', 'Nature TV',
             'Reality TV', 'Spirituality', 'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
            ]].head(top_n).reset_index(drop=True)



# %%
def find_hidden_gems(ratings, movies):
    """
    Finds hidden gem movies: highly rated but not super popular.

    Parameters:
    - ratings (DataFrame): must have 'show_id' and 'rating' columns.
    - movies (DataFrame): must have 'show_id' and 'title' columns.

    Returns:
    - DataFrame of top 10 hidden gems.
    """
    ratings = ratings.copy()
    movies = movies.copy()

    # Ensure 'show_id' is a string
    ratings['show_id'] = ratings['show_id'].astype(str)
    movies['show_id'] = movies['show_id'].astype(str)

    # Step 1: Calculate avgRating and numRatings
    ratings_summary = ratings.groupby('show_id').agg(
        avgRating=('rating', 'mean'),
        numRatings=('rating', 'count')
    ).reset_index()

    # Step 2: Merge ONLY avgRating and numRatings
    movies = movies.merge(
        ratings_summary[['show_id', 'avgRating', 'numRatings']],
        on='show_id',
        how='left'
    )

    # Step 3: Find Hidden Gems
    hidden_gems = movies[
        (movies['avgRating'] >= 4.0) & (movies['numRatings'] < 50)
    ].sort_values(by='avgRating', ascending=False)

    # Step 4: Return top 10 hidden gems
    return hidden_gems[['show_id', 'title', 'description', 'director', 'cast', 'release_year', 'rating', 'duration',
             'Action', 'Adventure', 'Anime Series International TV Shows', 'British TV Shows Docuseries International TV Shows',
             'Children', 'Comedies', 'Comedies Dramas International Movies', 'Comedies International Movies',
             'Comedies Romantic Movies', 'Crime TV Shows Docuseries', 'Documentaries',
             'Documentaries International Movies', 'Docuseries', 'Dramas', 'Dramas International Movies',
             'Dramas Romantic Movies', 'Family Movies', 'Fantasy', 'Horror Movies', 'International Movies Thrillers',
             'International TV Shows Romantic TV Shows TV Dramas', "Kids' TV", 'Language TV Shows', 'Musicals', 'Nature TV',
             'Reality TV', 'Spirituality', 'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
            ]].head(10)


# %%
def genre_based_recommendations_all_movies(ratings, movies):
    import pandas as pd
    import numpy as np

    ratings = ratings.copy()
    movies = movies.copy()

    # Ensure 'show_id' is a string
    ratings['show_id'] = ratings['show_id'].astype(str)
    movies['show_id'] = movies['show_id'].astype(str)

    # Step 1: Calculate avgRating and numRatings
    ratings_summary = ratings.groupby('show_id').agg(
        avgRating=('rating', 'mean'),
        numRatings=('rating', 'count')
    ).reset_index()

    # Step 2: Merge ratings_summary into movies
    movies = movies.merge(
        ratings_summary[['show_id', 'avgRating', 'numRatings']],
        on='show_id',
        how='left'
    )

    # Step 3: Identify genre columns (binary 0/1 columns)
    genre_columns = [
        col for col in movies.columns
        if set(movies[col].dropna().unique()).issubset({0, 1})
    ]

    # Step 4: Build recommendations
    records = []

    for genre in genre_columns:
        genre_movies = movies[movies[genre] == 1]

        if not genre_movies.empty:
            genre_movies = genre_movies.copy()
            genre_movies['weightedScore'] = genre_movies['avgRating'] * np.log10(genre_movies['numRatings'] + 1)
            genre_movies = genre_movies.sort_values(by='weightedScore', ascending=False)

            top_movies = genre_movies.head(5)

            for _, row in top_movies.iterrows():
                records.append({
                    'genre': genre,
                    'show_id': row['show_id'],
                    'title': row['title'],
                    'description': row['description'],
                    'director': row['director'],
                    'cast': row['cast'],
                    'release_year': row['release_year'],
                    'rating': row['rating'],
                    'duration': row['duration'],
                    'Action': row['Action'],
                    'Adventure': row['Adventure'],
                    'Anime Series International TV Shows': row['Anime Series International TV Shows'],
                    'British TV Shows Docuseries International TV Shows': row['British TV Shows Docuseries International TV Shows'],
                    'Children': row['Children'],
                    'Comedies': row['Comedies'],
                    'Comedies Dramas International Movies': row['Comedies Dramas International Movies'],
                    'Comedies International Movies': row['Comedies International Movies'],
                    'Comedies Romantic Movies': row['Comedies Romantic Movies'],
                    'Crime TV Shows Docuseries': row['Crime TV Shows Docuseries'],
                    'Documentaries': row['Documentaries'],
                    'Documentaries International Movies': row['Documentaries International Movies'],
                    'Docuseries': row['Docuseries'],
                    'Dramas': row['Dramas'],
                    'Dramas International Movies': row['Dramas International Movies'],
                    'Dramas Romantic Movies': row['Dramas Romantic Movies'],
                    'Family Movies': row['Family Movies'],
                    'Fantasy': row['Fantasy'],
                    'Horror Movies': row['Horror Movies'],
                    'International Movies Thrillers': row['International Movies Thrillers'],
                    'International TV Shows Romantic TV Shows TV Dramas': row['International TV Shows Romantic TV Shows TV Dramas'],
                    "Kids' TV": row["Kids' TV"],
                    'Language TV Shows': row['Language TV Shows'],
                    'Musicals': row['Musicals'],
                    'Nature TV': row['Nature TV'],
                    'Reality TV': row['Reality TV'],
                    'Spirituality': row['Spirituality'],
                    'TV Action': row['TV Action'],
                    'TV Comedies': row['TV Comedies'],
                    'TV Dramas': row['TV Dramas'],
                    'Talk Shows TV Comedies': row['Talk Shows TV Comedies'],
                    'Thrillers': row['Thrillers'],
                    'weightedScore': row['weightedScore']
   # Keep the score for ranking
                })


    recommendations_df = pd.DataFrame(records)
    return recommendations_df
