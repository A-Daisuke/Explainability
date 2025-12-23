import pandas as pd

try:
    df = pd.read_pickle("input.pkl")
    # Find pair_000_fast.js
    record = None
    for i in range(len(df)):
        file_info = df.iloc[i]["file"]
        if "pair_000_fast.js" in file_info["graph_name"]:
            record = file_info
            break
            
    if record:
        print(f"Graph Name: {record['graph_name']}")
        nodes_codes = record["graph_nodes_codes"]
        nodes_type = record["graph_nodes_type"]
        
        print(f"Total Nodes: {len(nodes_codes)}")
        
        for i in range(len(nodes_codes)):
            node = nodes_codes[i]
            # Expected structure: [Type, RangeDict, CommentList, CodeList]
            n_type = node[0]
            n_range = node[1]
            n_code = node[3]
            
            print(f"Node {i}: Type={n_type}, Range={n_range}")
            # print(f"Code: {n_code}") # Skip code to keep output clean, rely on range
            print("-" * 20)
            
    else:
        print("pair_000_fast.js not found in input.pkl")

except Exception as e:
    print(f"Error: {e}")
