import pandas as pd
import torch
import sys

try:
    df = pd.read_pickle("input.pkl")
    print(f"Loaded input.pkl. Records: {len(df)}")
    
    # Find pair_037_slow.js
    found = False
    for i in range(len(df)):
        file_info = df.iloc[i]["file"]
        if "pair_037_slow.js" in file_info["graph_name"]:
            print(f"Found pair_037_slow.js at index {i}")
            data = df.iloc[i]["input"]
            print(f"x shape: {data.x.shape}")
            print(f"edge_index shape: {data.edge_index.shape}")
            print(f"edge_index max: {data.edge_index.max()}")
            print(f"edge_index min: {data.edge_index.min()}")
            
            num_nodes = data.x.shape[0]
            if data.edge_index.max() >= num_nodes:
                print(f"ERROR: edge_index max {data.edge_index.max()} >= num_nodes {num_nodes}")
                # Find which edges are bad
                bad_edges = data.edge_index[:, data.edge_index[0] >= num_nodes]
                if bad_edges.shape[1] > 0:
                    print(f"Bad edges (source >= num_nodes): {bad_edges}")
                bad_edges = data.edge_index[:, data.edge_index[1] >= num_nodes]
                if bad_edges.shape[1] > 0:
                    print(f"Bad edges (target >= num_nodes): {bad_edges}")
            else:
                print("Graph seems valid (indices within bounds).")
            found = True
            break
    
    if not found:
        print("pair_037_slow.js not found in input.pkl")

except Exception as e:
    print(f"Error: {e}")
