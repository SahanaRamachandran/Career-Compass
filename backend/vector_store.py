import faiss
import numpy as np
from typing import List, Dict, Tuple


class VectorStore:
    """Manage FAISS vector store for similarity search."""
    
    def __init__(self, dimension: int = 1536):
        """
        Initialize FAISS index.
        
        Args:
            dimension: Dimension of embedding vectors (1536 for text-embedding-3-small)
        """
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product (for normalized vectors = cosine)
        self.texts = []
    
    def add_vector(self, vector: List[float], text: str):
        """
        Add a vector to the index.
        
        Args:
            vector: Embedding vector
            text: Original text corresponding to the vector
        """
        # Normalize vector for cosine similarity
        vector_np = np.array([vector], dtype=np.float32)
        faiss.normalize_L2(vector_np)
        
        self.index.add(vector_np)
        self.texts.append(text)
    
    def search(self, query_vector: List[float], k: int = 1) -> List[Tuple[str, float]]:
        """
        Search for similar vectors.
        
        Args:
            query_vector: Query embedding vector
            k: Number of results to return
            
        Returns:
            List of (text, similarity_score) tuples
        """
        # Normalize query vector
        query_np = np.array([query_vector], dtype=np.float32)
        faiss.normalize_L2(query_np)
        
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.texts):
                results.append((self.texts[idx], float(distances[0][i])))
        
        return results
    
    def clear(self):
        """Clear the index and stored texts."""
        self.index = faiss.IndexFlatIP(self.dimension)
        self.texts = []
