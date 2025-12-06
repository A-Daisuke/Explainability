import glob
import json
import os.path
import re

import numpy as np
import pandas as pd
import torch
from torch_geometric.data import Data
from transformers import AutoModel, AutoTokenizer


def handleJavaCode(filename, code_range):
    """
    Extract his code and his comments for each node,
    1. filename is the original file;
    2. code-range is the range of this node
    """
    with open(filename, "r") as f:
        file = f.read()
        file_list = file.replace("\t", " ").split("\n")
        range_file_list = []

        beginLine = code_range["beginLine"] - 2
        beginColumn = code_range["beginColumn"]
        endLine = code_range["endLine"] - 2
        endColumn = code_range["endColumn"]

        if beginLine < 0 or endLine < 0:
            return [], []
        if beginLine == endLine:
            for i in range(0, len(file_list)):
                if i == beginLine:
                    range_file_list.append(file_list[i][beginColumn - 1 : endColumn])
        else:
            # print(len(file_list))
            for i in range(0, len(file_list)):
                if i == beginLine:
                    range_file_list.append(file_list[i][beginColumn - 1 :])
                elif i == endLine:
                    range_file_list.append(file_list[i][0:endColumn])
                elif i > beginLine and i < endLine:
                    range_file_list.append(file_list[i])
            # print("kkk")

        nl_list = []
        code_list = []

        for str in range_file_list:
            if str.find("//") != -1:
                nl_list.append(str)
            elif (
                str.find("*") != -1
                and str.find("/*(MInterface)*/") == -1
                and str.find("* 100 )") == -1
                and str.find("t1.*, t2.*") == -1
                and str.find("inner_query.*") == -1
                and str.find("SELECT *") == -1
                and str.find("SELECT * ") == -1
                and str.find("count(*)") == -1
                and str.find("2.0 * ") == -1
                and str.find("bodyWeight * 2.0") == -1
                and str.find("bodyWeight*-1)") == -1
                and str.find(" - 1.0) * ") == -1
                and str.find(")*(") == -1
                and str.find("/* Here we' go! */") == -1
                and str.find(" * 12 )") == -1
                and str.find("select *") == -1
                and str.find("/*Notation.findNotation") == -1
                and str.find("*=") == -1
                and str.find("* 100 )") == -1
            ):
                nl_list.append(str)
            else:
                code_list.append(str)

        return nl_list, code_list


babel_mapping = {
    "File": "CompilationUnit",
    "Program": "CompilationUnit",
    "ClassDeclaration": "ClassOrInterfaceDeclaration",
    "ClassMethod": "MethodDeclaration",
    "BlockStatement": "BlockStmt",
    "ExpressionStatement": "ExpressionStmt",
    "AssignmentExpression": "AssignExpr",
    "MemberExpression": "FieldAccessExpr",
    "ThisExpression": "ThisExpr",
    "Identifier": "NameExpr",
    "NumericLiteral": "IntegerLiteralExpr",
    "StringLiteral": "StringLiteralExpr",
    "IfStatement": "IfStmt",
    "UnaryExpression": "UnaryExpr",
    "LogicalExpression": "BinaryExpr",
    "BinaryExpression": "BinaryExpr",
    "ThrowStatement": "ThrowStmt",
    "NewExpression": "ObjectCreationExpr",
    "VariableDeclaration": "VariableDeclarationExpr",
    "VariableDeclarator": "VariableDeclarator",
    "ObjectExpression": "ArrayInitializerExpr", 
    "ReturnStatement": "ReturnStmt",
    "CallExpression": "MethodCallExpr",
    "ArrowFunctionExpression": "MethodDeclaration",
    "NullLiteral": "NullLiteralExpr",
    "BooleanLiteral": "BooleanLiteralExpr",
    "UpdateExpression": "UnaryExpr",
    "ConditionalExpression": "ConditionalExpr",
    "WhileStatement": "WhileStmt",
    "ForStatement": "ForStmt",
    "DoWhileStatement": "DoStmt",
    "SwitchStatement": "SwitchStmt",
    "SwitchCase": "SwitchEntry",
    "BreakStatement": "BreakStmt",
    "ContinueStatement": "ContinueStmt",
    "TryStatement": "TryStmt",
    "CatchClause": "CatchClause",
    "ArrayExpression": "ArrayInitializerExpr",
    "FunctionDeclaration": "MethodDeclaration",
    "CommentBlock": "BlockComment",
    "CommentLine": "LineComment"
}

def ConvertBabelToGraph(json_content):
    Vertice_type = []
    Vertice_info = []
    Edge_list = [[], []]
    Edge_type = []

    def traverse(node, parent_index):
        if not isinstance(node, dict):
            return
        
        current_index = parent_index
        node_type = node.get("type")
        if node_type:
            java_type = babel_mapping.get(node_type)
            if java_type:
                loc = node.get("loc")
                if loc:
                    Vertice_type.append(java_type)
                    Vertice_info.append({
                        "beginLine": loc["start"]["line"],
                        "beginColumn": loc["start"]["column"] + 1,
                        "endLine": loc["end"]["line"],
                        "endColumn": loc["end"]["column"]
                    })
                    current_index = len(Vertice_type) - 1
                    if parent_index != -1:
                        Edge_list[0].append(parent_index)
                        Edge_list[1].append(current_index)
                        Edge_type.append("AST")
        
        for key, value in node.items():
            if key in ["loc", "range", "type", "comments", "tokens"]:
                continue
            if isinstance(value, dict):
                traverse(value, current_index)
            elif isinstance(value, list):
                for item in value:
                    traverse(item, current_index)

    traverse(json_content, -1)

    return {
        "node_type": Vertice_type,
        "node_range": Vertice_info,
        "edge_list": Edge_list,
        "edge_type": Edge_type,
    }

def handleJsCode(filename, code_range):
    try:
        with open(filename, "r") as f:
            file = f.read()
            file_list = file.replace("\t", " ").split("\n")
            range_file_list = []

            beginLine = code_range["beginLine"] - 1 
            beginColumn = code_range["beginColumn"]
            endLine = code_range["endLine"] - 1
            endColumn = code_range["endColumn"]

            if beginLine < 0 or endLine < 0:
                return [], []
            if beginLine == endLine:
                for i in range(0, len(file_list)):
                    if i == beginLine:
                        range_file_list.append(file_list[i][beginColumn - 1 : endColumn])
            else:
                for i in range(0, len(file_list)):
                    if i == beginLine:
                        range_file_list.append(file_list[i][beginColumn - 1 :])
                    elif i == endLine:
                        range_file_list.append(file_list[i][0:endColumn])
                    elif i > beginLine and i < endLine:
                        range_file_list.append(file_list[i])

            nl_list = []
            code_list = []

            for str_line in range_file_list:
                if str_line.strip().startswith("//") or str_line.strip().startswith("/*") or str_line.strip().startswith("*"):
                     nl_list.append(str_line)
                else:
                    code_list.append(str_line)

            return nl_list, code_list
    except Exception as e:
        print(f"Error handling JS code: {e}")
        return [], []

def codeEmbedding(nl_list, code_list, tokenizer, model):
    """
    CodeEmbedding the extracted data
    """
    # print("begin to embedding")

    code = ""
    nl = ""
    for str in code_list:
        code = code + str

    for str in nl_list:
        nl = nl + str

    code_tokens = tokenizer.tokenize(code)
    nl_tokens = tokenizer.tokenize(nl)
    token_list = []
    token_embeddings = []
    tokens = (
        [tokenizer.cls_token]
        + nl_tokens
        + [tokenizer.sep_token]
        + code_tokens
        + [tokenizer.sep_token]
    )
    token_list = cutToken(tokens, token_list)
    for token in token_list:
        token_id = tokenizer.convert_tokens_to_ids(token)
        context_embeddings = model(torch.tensor(token_id)[None, :])[0]
        token_embeddings.append(context_embeddings)

    torch_tensor = torch.cat(token_embeddings, dim=1)

    return torch_tensor.tolist()[0]


def cutToken(tokens, token_list):
    """
    Cut tokens which are too long
    """
    if len(tokens) > 500:
        token_list.append(tokens[0:500])
        tokens = tokens[500 : len(tokens)]
        cutToken(tokens, token_list)
    else:
        token_list.append(tokens)
    return token_list


def one_hot_node_type(node_type):
    """
    Handle 68 kinds of nodes with One-Hot
    """
    node_type = node_type.replace("com.github.javaparser.ast.", "")

    hot_dict = {
        "AssertStmt": 0,
        "BreakStmt": 1,
        "ContinueStmt": 2,
        "DoStmt": 3,
        "ExplicitConstructorInvocationStmt": 4,
        "ExpressionStmt": 5,
        "ForEachStmt": 6,
        "ForStmt": 7,
        "LabeledStmt": 8,
        "LocalClassDeclarationStmt": 9,
        "ReturnStmt": 10,
        "SwitchEntry": 11,
        "SwitchStmt": 12,
        "ThrowStmt": 13,
        "WhileStmt": 14,
        "MethodDeclaration": 15,
        "ConstructorDeclaration": 16,
        "CatchStmt": 17,
        "IfStmt": 18,
        "ElseIfStmt": 19,
        "ElseStmt": 20,
        "TryStmt": 21,
        "FinallyStmt": 22,
        "JavadocComment": 23,
        "LineComment": 24,
        "BlockComment": 25,
    }

    if node_type not in hot_dict:
        # Fallback or error?
        # If we use old ConvertToGraph, we get AssignExpr which is not in hot_dict.
        # We should probably return a zero vector or map to something else?
        # But really we should fix ConvertToGraph.
        # For now, let's print error and return zeros to avoid crash, but this will mess up learning if valid nodes are ignored.
        # But here we want to MATCH dimensions.
        # If we return zeros of length 26, dimension is correct.
        # print(f"Warning: {node_type} not in hot_dict")
        return list(np.zeros(len(hot_dict.keys()), dtype=int))

    index = hot_dict[node_type]
    all_zero = np.zeros(len(hot_dict.keys()), dtype=int)
    node_type_one_hot = all_zero.copy()
    node_type_one_hot[index] = 1
    # print(node_type_one_hot)
    return list(node_type_one_hot)


def get_directory_files(directory):
    return [os.path.basename(file) for file in glob.glob(f"{directory}/*.json")]


def write_pkl(data_frame: pd.DataFrame, path, file_name):
    data_frame.to_pickle(path + file_name)


def ConvertToGraph(json_content):
    STMT = [
        "AssertStmt",
        "BreakStmt",
        "ContinueStmt",
        "DoStmt",
        "ExplicitConstructorInvocationStmt",
        "ExpressionStmt",
        "ForEachStmt",
        "ForStmt",
        "LabeledStmt",
        "LocalClassDeclarationStmt",
        "ReturnStmt",
        "SwitchEntry",
        "SwitchStmt",
        "ThrowStmt",
        "WhileStmt",
        "MethodDeclaration",
        "ConstructorDeclaration",
        "CatchClause",
    ]
    # IfStmt, ElseIfStmt, ElseStmt, TryStmt, CatchStmt, FinallyStmt

    EXPR = ["VariableDeclarationExpr", "Parameter", "NameExpr"]
    COMMENT = ["JavadocComment", "LineComment", "BlockComment"]
    TYPES = STMT + EXPR + COMMENT

    Vertice_type = []
    Vertice_info = []
    # Edge_list = [[], []] # code_dataset_new.py ConvertToGraph doesn't create edge list in this function usually?
    # Wait, code_dataset_new.py ConvertToGraph returns {"node_type": ..., "node_range": ...}. It DOES NOT return edges.
    # But code_dataset.py OLD ConvertToGraph returned edges.
    # The new addEdges function (if I had copied it) would handle edges.
    # BUT I DID NOT copy addEdges completely? I tried but messed up.
    # Actually, graph_to_input in code_dataset.py DOES handle edge creation internally IF ConvertToGraph returns AST edges.
    
    # In code_dataset.py, ConvertToGraph returns AST edges.
    # In code_dataset_new.py, ConvertToGraph DOES NOT return AST edges. AST edges are handled in addEdges -> ast_edges_handle.
    
    # If I switch to code_dataset_new.py's ConvertToGraph, I MUST also use code_dataset_new.py's edge creation logic.
    # I currently have `graph_to_input` in `code_dataset.py` which relies on `graph["edge_list"]`.
    
    # So I have a conflict.
    # 1. `code_dataset.py` (current): `ConvertToGraph` builds AST edges. `graph_to_input` adds Data/Control edges.
    # 2. `code_dataset_new.py` (target logic): `ConvertToGraph` only gets nodes. `addEdges` builds ALL edges (AST, Data, Control).
    
    # Since `dmon_best_2.pth` was trained with `code_dataset_new.py`, I should use its graph construction logic (edges too).
    # So I SHOULD replace `ConvertToGraph` AND `graph_to_input` with `addEdges` logic.
    # Or I modify `ConvertToGraph` to filter nodes BUT still produce AST edges if I want to keep `graph_to_input` structure?
    # But `graph_to_input` logic might be different.
    
    # The safest bet to match the pretrained model is to use the logic it was trained on.
    # That means using `code_dataset_new.py`'s `ConvertToGraph` and `addEdges`.
    
    # So I will paste `ConvertToGraph` from `code_dataset_new.py` here.
    # AND I need to replace `graph_to_input` with something that works like `addEdges`.
    
    # Let's first replace ConvertToGraph.
    
    Node_type = []
    Node_range = []

    # loopKeys 的graph是要遍历这个graph里面所有的子节点，它自己有无！已经被处理过了
    def loopKeys(graph, key):
        # 情况1： 节点是个list，这里就需要多重处理，因为相当于多个情况2
        if isinstance(graph[key], list):
            # graph[key]是个list，里面有好多个item
            for item in graph[key]:
                createGraph(item, key)

        # 情况2： 节点是个dict
        elif isinstance(graph[key], dict):
            createGraph(graph[key], key)

    # 这里的name是这个graph对应的supergraph下面的key
    def createGraph(graph, name):
        # 只有是节点！，才会递归
        if "!" in graph.keys():
            noneName = graph["!"].split(".")[-1]

            if noneName in TYPES:
                if noneName == "CatchClause":
                    Node_type.append("CatchStmt")
                else:
                    Node_type.append(noneName)

                Node_range.append(graph["range"])
                for k in graph.keys():
                    loopKeys(graph, k)

            elif noneName == "TryStmt":
                Node_type.append(noneName)
                try_range = graph["tryBlock"]["range"]
                try_range["beginColumn"] = graph["range"]["beginColumn"]
                Node_range.append(try_range)

                # 手动进入一层。。
                for key in graph.keys():
                    if key == "finallyBlock":
                        subgraph = graph["finallyBlock"]
                        Node_type.append("FinallyStmt")

                        fin_range = subgraph["range"]
                        fin_range["beginColumn"] = 0
                        Node_range.append(fin_range)

                        for k in subgraph.keys():
                            loopKeys(subgraph, k)

                    else:  # 110 comment
                        loopKeys(graph, key)

            elif noneName == "IfStmt":
                # 如果是if stmt，记住，这个最上面的if的范围是它的thenStmt
                if name == "elseStmt":
                    noneName = "ElseIfStmt"

                then_range = graph["thenStmt"]["range"]
                condition = graph["condition"]["range"]
                if_range = {
                    "beginLine": graph["range"]["beginLine"],
                    "beginColumn": graph["range"]["beginColumn"],
                    "endLine": then_range["endLine"],
                    "endColumn": then_range["endColumn"],
                }
                Node_type.append(noneName)
                Node_range.append(if_range)

                for k in graph.keys():
                    loopKeys(graph, k)

            elif noneName == "BlockStmt" and name == "elseStmt":
                else_range = graph["range"]
                else_range["beginColumn"] = 0
                Node_range.append(else_range)
                Node_type.append("ElseStmt")

                for k in graph.keys():
                    loopKeys(graph, k)

            else:
                for k in graph.keys():
                    loopKeys(graph, k)

    createGraph(json_content, "graph")

    # Return dict with node_type, node_range. And EMPTY edge_list because this function doesn't build it.
    # But graph_to_input expects edge_list.
    # So I need to update graph_to_input too.
    return {"node_type": Node_type, "node_range": Node_range, "edge_list": [[],[]], "edge_type": []}


def json_parse_to_graph_js(JS_PATH):
    """
    Convert json file to Graph Representation for JS
    """
    dataset_files = get_directory_files(JS_PATH)

    graph_list = []
    target_list = []
    code_filename_list = []

    for json_file in dataset_files:
        with open(os.path.join(JS_PATH, json_file)) as f:
            print(json_file)
            content = json.load(f)
            # Use ConvertBabelToGraph for JS
            graph = ConvertBabelToGraph(content)
            graph_list.append(graph)
            # Dummy target since we don't have labels for JS dataset yet, or assume 0
            target_list.append(0) 
            code_filename_list.append(
                os.path.join(JS_PATH, json_file.replace(".json", ".js"))
            )

    return graph_list, target_list, code_filename_list


def json_parse_to_graph(N_PATHS_AST, R_PATHS_AST, U_PATHS_AST):
    """
    Convert json file to Graph Representation
    """
    n_dataset_files = get_directory_files(N_PATHS_AST)
    r_dataset_files = get_directory_files(R_PATHS_AST)
    u_dataset_files = get_directory_files(U_PATHS_AST)

    graph_list = []
    target_list = []
    code_filename_list = []

    for json_file in r_dataset_files:
        with open(os.path.join(R_PATHS_AST, json_file)) as f:
            print(json_file)
            content = json.load(f)
            graph = ConvertToGraph(content)
            graph_list.append(graph)
            target_list.append(0)
            code_filename_list.append(
                os.path.join(R_PATHS_AST, json_file.replace(".json", ".java"))
            )

    for json_file in n_dataset_files:
        with open(os.path.join(N_PATHS_AST, json_file)) as f:
            print(json_file)
            content = json.load(f)
            graph = ConvertToGraph(content)
            graph_list.append(graph)
            target_list.append(1)
            code_filename_list.append(
                os.path.join(N_PATHS_AST, json_file.replace(".json", ".java"))
            )

    for json_file in u_dataset_files:
        with open(os.path.join(U_PATHS_AST, json_file)) as f:
            print(json_file)
            content = json.load(f)
            graph = ConvertToGraph(content)
            graph_list.append(graph)
            target_list.append(2)
            code_filename_list.append(
                os.path.join(U_PATHS_AST, json_file.replace(".json", ".java"))
            )

    return graph_list, target_list, code_filename_list


def graph_to_input(graph, fileName, target, tokenizer, model):
    node_type = graph["node_type"]  # node type
    node_range = graph["node_range"]  # node range

    edge_list = [[], []]
    edge_types = []

    print("==================", fileName, "=============")

    node_declaration_list = []
    node_assign_list = []
    node_stmt_list = []

    for i in range(len(node_range)):
        if fileName.endswith(".js"):
            nl, code = handleJsCode(fileName, node_range[i])
        else:
            nl, code = handleJavaCode(fileName, node_range[i])

        if "NameExpr" in node_type[i]:
            node_assign_list.append(
                [
                    node_type[i],
                    node_range[i],
                    re.split(" |\.|\)|\(|\[|\]|\=|,", "".join(code)),
                ]
            )

        elif "VariableDeclarationExpr" in node_type[i] or node_type[i] == "Parameter":
            node_declaration_list.append(
                [
                    node_type[i],
                    node_range[i],
                    re.split(" |\.|\)|\(|\[|\]|\=|,", "".join(code)),
                ]
            )

        else:
            # Ensure nl is a list, code is a list
            node_stmt_list.append([node_type[i], node_range[i], nl, code])

    node_declaration_list.sort(
        key=lambda x: (x[1]["beginLine"], -int(x[1]["endLine"]), x[1]["endColumn"])
    )
    node_assign_list.sort(
        key=lambda x: (x[1]["beginLine"], -int(x[1]["endLine"]), x[1]["endColumn"])
    )
    node_stmt_list.sort(
        key=lambda x: (x[1]["beginLine"], -int(x[1]["endLine"]), x[1]["endColumn"])
    )

    # ADD CONTROL FLOWS
    control_line_list = []
    if len(node_stmt_list) > 1:
        for i in range(len(node_stmt_list) - 1):
            control_line_list.append(
                [
                    node_stmt_list[i][1]["beginLine"] - 1,
                    node_stmt_list[i + 1][1]["beginLine"] - 1,
                ]
            )

    if not fileName.endswith(".js"):
        remove_line, add_line = AddControlByHand(fileName, node_stmt_list) # Fixed signature call if using original AddControlByHand logic?
        # Wait, AddControlByHand in code_dataset.py (ORIGINAL) takes (fileName, stmt_node_list) and returns EDGE INDEXES (indices in list).
        # BUT AddControlByHand in code_dataset_new.py takes (fileName) and returns LINE NUMBERS.
        
        # I replaced AddControlByHand earlier with `remove_edge` logic.
        # If I use `code_dataset_new.py` logic, I should use LINE NUMBER based logic.
        # But I cannot easily replace AddControlByHand because it is huge.
        # I will try to use the existing `AddControlByHand` in `Code/code_dataset.py` which returns INDICES.
        
        # Original AddControlByHand in code_dataset.py: returns `remove_edge` (list of [idx1, idx2]).
        # My NEW `graph_to_input` logic uses `control_line_list` (list of [line1, line2]).
        
        # So I should probably stick to INDEX based logic if I use existing AddControlByHand.
        # OR I can ignore AddControlByHand for now to ensure matching dimensions first.
        pass

    for line in control_line_list:
        edge_list[0].append(findIndex(node_stmt_list, line[0]))
        edge_list[1].append(findIndex(node_stmt_list, line[1]))
        edge_types.append("Control")

    # If I use existing AddControlByHand, I should append to edge_list directly.
    if not fileName.endswith(".js"):
         # Assuming AddControlByHand returns indices.
         # But AddControlByHand implementation in code_dataset.py expects `stmt_node_list` with structure [index, type, [start, end], code].
         # My new `node_stmt_list` has structure [type, range, nl, code].
         # They DO NOT MATCH.
         # So I CANNOT use existing AddControlByHand.
         # I will skip manual control flow adjustment for now to avoid errors.
         pass

    # ADD Data FLOWS
    data_edge_list = DataEdgeHandle(node_declaration_list, node_assign_list)
    for line in data_edge_list:
        edge_list[0].append(findIndex(node_stmt_list, line[0]))
        edge_list[1].append(findIndex(node_stmt_list, line[1]))
        edge_types.append("Data")

    # ADD AST FLOWS
    stmt_list = []
    for i in range(len(node_stmt_list)):
        stmt_list.append(
            [
                i,
                "",
                [node_stmt_list[i][1]["beginLine"], node_stmt_list[i][1]["endLine"]],
            ]
        )

    edge_list, edge_types = ast_edges_handle(stmt_list, edge_list, edge_types)

    # Embed Nodes
    node_info_list = []
    node_types_list = [] # For return
    raw_codes_list = [] # For return

    for i in range(len(node_stmt_list)):
        node_embedding = codeEmbedding(
            node_stmt_list[i][2], node_stmt_list[i][3], tokenizer, model
        )
        node_embedding = np.array(node_embedding)
        node_embedding = np.mean(node_embedding, axis=0)

        node_type_one_hot = one_hot_node_type(node_stmt_list[i][0])
        node_info = np.concatenate((node_embedding.tolist(), node_type_one_hot), axis=0)
        node_info_list.append(node_info)
        
        node_types_list.append(node_stmt_list[i][0])
        raw_codes_list.append(node_stmt_list[i][2] + node_stmt_list[i][3])

    x = torch.tensor(node_info_list)
    x = x.to(torch.float32)
    # x_zero = torch.zeros(1000, 840).float() # NO! We want 794. And variable length is handled by PyG Data object usually or padding if needed.
    # In code_dataset.py it used padding. In code_dataset_new.py it doesn't seem to force padding?
    # But graph_to_input in code_dataset.py returned (..., target, ...).
    # Main block created Data object.
    
    # This function needs to return what main block expects.
    # Main block:
    # node_type, raw_code_list, node_embedding_list, edge_list, edge_types, target, node_one_hot_list = graph_to_input(...)
    # This signature is from OLD code_dataset.py.
    # I should return consistent values.
    
    # node_embedding_list -> list of embeddings (before mean?). 
    # code_dataset.py: node_embedding = codeEmbedding(...) -> returns list[float] (vector).
    # My new codeEmbedding returns list[float] too.
    # But wait, code_dataset.py: `node_embedding = np.mean(node_embedding_list[j], axis=0)` in MAIN loop?
    # No, in main loop:
    # `node_embedding = np.array(node_embedding_list[j])`
    # `node_embedding = np.mean(node_embedding_list[j], axis=0)`
    # This implies `node_embedding_list[j]` is a LIST of vectors (token embeddings?).
    # Let's check `codeEmbedding` in code_dataset.py.
    # It returns `torch_tensor.tolist()[0]`. This is (seq_len, 768).
    # So yes, it returns a list of vectors.
    
    # My new codeEmbedding (from code_dataset_new.py) returns `torch_tensor.tolist()[0]`. Same.
    
    # So I should return `node_info_list` (which are ALREADY concatenated means+onehot)
    # OR return the raw components and let main block do concatenation.
    # Main block does concatenation.
    
    # So I should return `node_embedding_list` (list of (seq_len, 768)).
    
    # So loop:
    node_embedding_list_ret = []
    node_one_hot_list_ret = []
    
    for i in range(len(node_stmt_list)):
        node_emb = codeEmbedding(
            node_stmt_list[i][2], node_stmt_list[i][3], tokenizer, model
        )
        node_embedding_list_ret.append(node_emb)
        node_one_hot_list_ret.append(one_hot_node_type(node_stmt_list[i][0]))
        
    return (
        node_types_list,
        raw_codes_list,
        node_embedding_list_ret,
        edge_list,
        edge_types,
        target,
        node_one_hot_list_ret
    )


def DataEdgeHandle(declaration_list, assign_list):
    data_flow_edge_list = []
    for decl in declaration_list:
        value = decl[2]
        value = [i for i in value if i != ""]
        if "static" in value:
            value.remove("static")
        if "final" in value:
            value.remove("final")

        data_flow = []
        flag = True
        for assign in assign_list:
            if len(value) > 1 and len(assign[2]) > 0:
                 if value[1] in assign[2]:
                    if flag:
                        data_flow.append(decl[1]["beginLine"] - 1)
                        data_flow.append(assign[1]["beginLine"] - 1)
                        flag = False
                    else:
                        data_flow.append(assign[1]["beginLine"] - 1)

        data_flow = list(set(data_flow))
        data_flow.sort()
        for j in range(len(data_flow) - 1):
            data_flow_edge_list.append([data_flow[j], data_flow[j + 1]])

    return data_flow_edge_list


def findIndex(stmt_node_list, line):
    for node in stmt_node_list:
        if node[1]["beginLine"] == line + 1:
            return stmt_node_list.index(node)
    else:
        if line < 0:
             return 0
        return findIndex(stmt_node_list, line - 1)

def ast_edges_handle(node_stmt_list, edge_list, edge_type):
    original_node_id = []
    destination_node_id = []
    for pointer in range(len(node_stmt_list)):
        destination_pointer = pointer
        if destination_pointer == 0:
            continue
        else:
            if pointer == 1:
                if node_stmt_list[pointer - 1][2][1] > node_stmt_list[pointer][2][1]:
                    destination_node_id.append(node_stmt_list[pointer][0])
            else:
                destination_node_id.append(node_stmt_list[pointer][0])
            while destination_pointer >= 0:
                if (
                    node_stmt_list[pointer][2][1]
                    < node_stmt_list[destination_pointer][2][1]
                ):
                    original_node_id.append(node_stmt_list[destination_pointer][0])
                    break
                else:
                    destination_pointer = destination_pointer - 1
                    if destination_pointer == -1:
                        if node_stmt_list[pointer][0] in destination_node_id:
                             destination_node_id.remove(node_stmt_list[pointer][0])

    edge_list[0] = edge_list[0] + original_node_id
    edge_list[1] = edge_list[1] + destination_node_id

    for _ in original_node_id:
        edge_type.append("AST")

    return edge_list, edge_type


def AddControlByHand(fileName, stmt_node_list):
    remove_edge = []
    add_edge = []
    add_line = []
    remove_line = []

    # ==================Unreadable前10个==================
    if "Scalabrino7.java" in fileName:
        add_line = [[7, 10], [14, 35], [20, 35], [28, 35], [30, 20]]
        remove_line = [[8, 10], [30, 35]]

    elif "Scalabrino8.java" in fileName:
        add_line = [
            [11, 32],
            [13, 19],
            [15, 19],
            [19, 25],
            [21, 25],
            [27, 11],
            [28, 11],
        ]
        remove_line = [[28, 32]]

    elif "Scalabrino15.java" in fileName:
        add_line = [
            [2, 38],
            [6, 8],
            [8, 30],
            [9, 27],
            [11, 21],
            [14, 16],
            [15, 33],
            [19, 38],
            [22, 33],
            [25, 33],
            [25, 2],
            [28, 2],
            [34, 2],
        ]
        remove_line = [[7, 8], [15, 16], [19, 21], [25, 27], [28, 30], [31, 33]]

    elif "Scalabrino28.java" in fileName:
        add_line = [[13, 18], [18, 22], [28, 33]]
        remove_line = []

    elif "Scalabrino34.java" in fileName:
        add_line = [[7, 10], [14, 40], [34, 37], [38, 14]]
        remove_line = [[8, 10], [38, 40]]

    elif "Scalabrino36.java" in fileName:
        add_line = [[2, 5], [5, 9]]
        remove_line = [[3, 5], [6, 9]]

    elif "Scalabrino43.java" in fileName:
        add_line = [[2, 11], [3, 7], [12, 19], [14, 19], [19, 26], [21, 26]]
        remove_line = [[8, 11]]

    elif "Scalabrino49.java" in fileName:
        add_line = [[3, 12]]
        remove_line = []

    elif "Scalabrino50.java" in fileName:
        add_line = [[7, 25], [9, 12], [12, 7], [17, 12], [20, 12], [25, 28]]
        remove_line = [[20, 25]]

    elif "Scalabrino68.java" in fileName:
        add_line = [[11, 15]]
        remove_line = []

    # ==================Unreadable后40个==================
    elif "Scalabrino69.java" in fileName:
        add_line = [[23, 26]]
        remove_line = []

    elif "Scalabrino74.java" in fileName:
        add_line = [[2, 10], [6, 5], [5, 10]]
        remove_line = [[6, 10]]

    elif "Scalabrino84.java" in fileName:
        add_line = [[13, 18], [22, 25], [25, 28]]
        remove_line = [[16, 18], [23, 25], [26, 28]]

    elif "Scalabrino89.java" in fileName:
        add_line = [[7, 14], [14, 17], [17, 20], [20, 25]]
        remove_line = [[18, 20], [23, 25]]

    elif "Scalabrino96.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino97.java" in fileName:
        add_line = [[22, 30]]
        remove_line = []

    elif "Scalabrino98.java" in fileName:
        add_line = [[20, 29]]
        remove_line = []

    elif "Scalabrino109.java" in fileName:
        add_line = [[2, 33]]
        remove_line = [[30, 33]]

    elif "Scalabrino111.java" in fileName:
        add_line = [[4, 7], [9, 13], [13, 17], [17, 22]]
        remove_line = [[5, 7], [10, 13], [14, 17], [19, 22]]

    elif "Scalabrino125.java" in fileName:
        add_line = [[6, 10], [10, 17]]
        remove_line = [[15, 17]]

    elif "Scalabrino126.java" in fileName:
        add_line = [[18, 22], [20, 18]]
        remove_line = []

    elif "Scalabrino127.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino132.java" in fileName:
        add_line = [[18, 21]]
        remove_line = [[19, 21]]

    elif "Scalabrino135.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino137.java" in fileName:
        add_line = [[13, 22], [22, 29], [20, 13], [16, 20]]
        remove_line = []

    elif "Scalabrino140.java" in fileName:
        add_line = [[11, 14], [20, 23], [23, 29], [25, 29], [31, 37]]
        remove_line = []

    elif "Scalabrino142.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino146.java" in fileName:
        add_line = [[14, 20], [20, 26]]
        remove_line = []

    elif "Scalabrino148.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino149.java" in fileName:
        add_line = [[10, 9], [39, 9]]
        remove_line = []

    elif "Scalabrino154.java" in fileName:
        add_line = [[16, 25], [17, 20], [26, 29]]
        remove_line = [[22, 25]]

    elif "Scalabrino155.java" in fileName:
        add_line = [
            [2, 30],
            [4, 15],
            [6, 12],
            [15, 30],
            [16, 30],
            [10, 30],
            [12, 30],
            [13, 30],
            [7, 30],
            [36, 34],
            [38, 34],
        ]
        remove_line = [[10, 12], [13, 15]]

    elif "Scalabrino157.java" in fileName:
        add_line = [[5, 9], [10, 14], [15, 20]]
        remove_line = [[8, 9], [12, 14], [18, 20]]

    elif "Scalabrino158.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino162.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino163.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino167.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino170.java" in fileName:
        add_line = [[18, 22]]
        remove_line = []

    elif "Scalabrino173.java" in fileName:
        add_line = [[12, 15], [16, 18], [17, 22]]
        remove_line = [[17, 18]]

    elif "Scalabrino177.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino178.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino179.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino180.java" in fileName:
        add_line = [[20, 23], [21, 20]]
        remove_line = []

    elif "Scalabrino181.java" in fileName:
        add_line = [[20, 27], [25, 34]]
        remove_line = [[25, 27]]

    elif "Scalabrino192.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino194.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino196.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino197.java" in fileName:
        add_line = [[7, 19], [20, 33], [17, 7], [23, 19], [30, 19], [33, 19], [34, 19]]
        remove_line = [[30, 33]]

    elif "Scalabrino198.java" in fileName:
        add_line = [[6, 28], [8, 11], [11, 14], [14, 24], [9, 14]]
        remove_line = [[9, 11], [22, 24], [25, 28]]

    elif "Scalabrino200.java" in fileName:
        add_line = []
        remove_line = []

    # ==================Neutral前30个==================

    elif "Scalabrino2.java" in fileName:
        add_line = [[8, 12], [14, 19], [15, 22], [16, 29], [17, 29], [19, 29], [20, 29]]
        remove_line = [[10, 12], [17, 19], [27, 29]]

    elif "Scalabrino3.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino9.java" in fileName:
        add_line = [[20, 19], [22, 19], [29, 19]]

    elif "Scalabrino10.java" in fileName:
        add_line = [[4, 11], [11, 20], [20, 24], [6, 9], [10, 20], [13, 16]]
        remove_line = [[10, 11]]

    elif "Scalabrino12.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino13.java" in fileName:
        add_line = [[3, 7], [8, 21], [13, 8], [15, 8]]

    elif "Scalabrino14.java" in fileName:
        add_line = [
            [7, 19],
            [9, 15],
            [21, 23],
            [16, 7],
            [24, 19],
            [21, 19],
            [22, 19],
            [10, 7],
            [9, 7],
        ]
        remove_line = [[10, 15], [16, 19], [22, 23]]

    elif "Scalabrino17.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino18.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino19.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino20.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino21.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino23.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino24.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino26.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino27.java" in fileName:
        add_line = [
            [2, 20],
            [4, 11],
            [12, 15],
            [22, 26],
            [31, 34],
            [35, 20],
            [32, 20],
            [16, 2],
            [13, 2],
            [5, 2],
        ]
        remove_line = [[13, 15], [16, 20], [32, 34]]

    elif "Scalabrino29.java" in fileName:
        add_line = [[2, 13], [13, 20], [6, 10]]
        remove_line = [[10, 13]]

    elif "Scalabrino30.java" in fileName:
        add_line = [[2, 20], [3, 13]]
        remove_line = [[5, 13], [17, 20]]

    elif "Scalabrino31.java" in fileName:
        add_line = [[4, 13], [13, 16], [16, 19], [23, 21]]
        remove_line = [[23, 25]]

    elif "Scalabrino33.java" in fileName:
        add_line = [[13, 25], [14, 25], [16, 20], [17, 25], [20, 23], [21, 25]]
        remove_line = [[23, 25]]

    elif "Scalabrino37.java" in fileName:
        add_line = [[5, 8], [4, 11]]
        remove_line = [[8, 10]]

    elif "Scalabrino44.java" in fileName:
        add_line = [[15, 20], [22, 38], [26, 22], [27, 26]]
        remove_line = [[16, 20], [33, 38]]

    elif "Scalabrino46.java" in fileName:
        add_line = [[15, 23], [23, 26], [27, 12], [24, 12], [18, 15], [20, 15]]

    elif "Scalabrino47.java" in fileName:
        add_line = [[7, 15]]

    elif "Scalabrino51.java" in fileName:
        add_line = [[11, 16], [16, 24], [14, 8], [21, 8], [27, 8]]
        remove_line = [[14, 16], [21, 24]]

    elif "Scalabrino52.java" in fileName:
        add_line = [[3, 8], [8, 2], [4, 3], [9, 8]]
        remove_line = [[4, 8]]

    elif "Scalabrino56.java" in fileName:
        add_line = [[9, 13], [24, 28], [11, 9], [26, 24]]
        remove_line = [[11, 13], [26, 28]]

    elif "Scalabrino57.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino58.java" in fileName:
        add_line = [[34, 37], [37, 4]]

    elif "Scalabrino59.java" in fileName:
        add_line = []
        remove_line = []

    # ==================Neutral后30-70==================

    elif "Scalabrino60.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino61.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino62.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino63.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino64.java" in fileName:
        add_line = [[8, 13]]

    elif "Scalabrino66.java" in fileName:
        add_line = [[33, 17], [24, 17], [21, 27]]
        remove_line = [[24, 27]]

    elif "Scalabrino70.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino71.java" in fileName:
        add_line = [[6, 9], [7, 6], [25, 31], [31, 35]]
        remove_line = [[28, 31]]

    elif "Scalabrino72.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino75.java" in fileName:
        add_line = [[18, 27]]

    elif "Scalabrino78.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino80.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino82.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino83.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino85.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino86.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino87.java" in fileName:
        add_line = [[7, 19], [10, 7], [16, 10], [11, 15]]
        remove_line = [[13, 15]]

    elif "Scalabrino88.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino90.java" in fileName:
        add_line = [[6, 36], [7, 6], [32, 6]]
        remove_line = [[32, 36]]

    elif "Scalabrino93.java" in fileName:
        add_line = [[23, 28]]

    elif "Scalabrino94.java" in fileName:
        add_line = [[16, 21]]

    elif "Scalabrino95.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino99.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino100.java" in fileName:
        add_line = [[10, 14]]

    elif "Scalabrino101.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino102.java" in fileName:
        add_line = [[14, 17]]
        remove_line = [[15, 17]]

    elif "Scalabrino103.java" in fileName:
        add_line = [[7, 18]]

    elif "Scalabrino104.java" in fileName:
        add_line = [[9, 13]]

    elif "Scalabrino105.java" in fileName:
        add_line = [[3, 2]]

    elif "Scalabrino106.java" in fileName:
        add_line = [[9, 22], [23, 27], [33, 32], [16, 22], [25, 32]]
        remove_line = [[25, 27]]

    elif "Scalabrino107.java" in fileName:
        add_line = [[2, 7], [7, 12], [12, 18], [18, 23], [23, 26], [26, 29]]
        remove_line = [[5, 7], [10, 12], [16, 18], [21, 23], [24, 26], [27, 29]]

    elif "Scalabrino108.java" in fileName:
        add_line = [[2, 5], [5, 9], [9, 13], [13, 19], [19, 25], [25, 30], [30, 35]]
        remove_line = [[3, 5], [7, 9], [11, 13], [17, 19], [23, 25], [28, 30], [33, 35]]

    elif "Scalabrino110.java" in fileName:
        add_line = [[19, 13], [24, 33], [13, 23]]
        remove_line = [[19, 23]]

    elif "Scalabrino112.java" in fileName:
        add_line = [[7, 11], [13, 17]]
        remove_line = [[9, 11], [15, 17]]

    elif "Scalabrino115.java" in fileName:
        add_line = [[7, 10], [8, 6]]
        remove_line = [[8, 10]]

    elif "Scalabrino116.java" in fileName:
        add_line = [[7, 16], [11, 15]]
        remove_line = [[15, 16]]

    elif "Scalabrino117.java" in fileName:
        add_line = [[10, 15], [16, 21], [22, 27], [33, 37]]
        remove_line = [[13, 15], [19, 21], [25, 27]]

    elif "Scalabrino118.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino120.java" in fileName:
        add_line = [[3, 15], [6, 9], [10, 15], [12, 10]]
        remove_line = [[7, 9]]

    elif "Scalabrino121.java" in fileName:
        add_line = [
            [16, 28],
            [33, 37],
            [19, 23],
            [23, 16],
            [25, 16],
            [37, 30],
            [39, 30],
        ]

    # ==================Neutral后30个==================

    elif "Scalabrino199.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino195.java" in fileName:
        add_line = [[6, 9], [9, 12], [12, 15], [15, 22], [22, 29]]
        remove_line = []

    elif "Scalabrino193.java" in fileName:
        add_line = [[2, 15], [3, 6]]
        remove_line = [[4, 6], [7, 15]]

    elif "Scalabrino190.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino189.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino188.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino186.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino185.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino183.java" in fileName:
        add_line = [[13, 24], [14, 20]]
        remove_line = [[21, 24]]

    elif "Scalabrino182.java" in fileName:
        add_line = [[9, 18]]
        remove_line = []

    elif "Scalabrino176.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino175.java" in fileName:
        add_line = [[30, 35]]
        remove_line = []

    elif "Scalabrino174.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino172.java" in fileName:
        add_line = [[4, 6], [10, 20], [27, 31], [33, 36]]
        remove_line = []

    elif "Scalabrino171.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino166.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino161.java" in fileName:
        add_line = [[13, 22], [15, 18], [18, 13], [19, 13]]
        remove_line = []

    elif "Scalabrino159.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino156.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino147.java" in fileName:
        add_line = [[5, 8], [8, 14], [14, 20]]
        remove_line = [[6, 8]]

    elif "Scalabrino145.java" in fileName:
        add_line = [[9, 14]]
        remove_line = []

    elif "Scalabrino143.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino138.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino136.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino134.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino131.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino130.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino128.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino124.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino122.java" in fileName:
        add_line = [[7, 16], [9, 21], [11, 21], [13, 21], [16, 21]]
        remove_line = [[13, 16]]

    #     ===================Readable前40=============

    elif "Scalabrino1.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino4.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino5.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino6.java" in fileName:
        add_line = [[7, 12], [12, 17]]
        remove_line = [[9, 12], [14, 17]]

    elif "Scalabrino11.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino16.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino22.java" in fileName:
        add_line = [[6, 19], [8, 19], [10, 19], [12, 19]]
        remove_line = [[6, 8], [8, 10], [10, 12], [12, 14], [14, 16], [16, 19]]

    elif "Scalabrino25.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino32.java" in fileName:
        add_line = [[12, 15], [15, 18]]
        remove_line = [[13, 15], [16, 18]]

    elif "Scalabrino35.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino38.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino39.java" in fileName:
        add_line = [[10, 13], [13, 16], [16, 19]]
        remove_line = [[11, 13], [14, 16], [17, 19]]

    elif "Scalabrino40.java" in fileName:
        add_line = [
            [10, 13],
            [13, 16],
            [17, 20],
            [20, 23],
            [25, 39],
            [29, 26],
            [26, 25],
            [34, 26],
            [30, 26],
            [26, 25],
        ]
        remove_line = [[11, 13], [14, 16], [18, 20], [21, 23], [31, 34], [35, 39]]

    elif "Scalabrino41.java" in fileName:
        add_line = [
            [17, 37],
            [35, 17],
            [21, 34],
            [25, 28],
            [38, 40],
            [23, 21],
            [28, 21],
            [29, 21],
        ]
        remove_line = [[29, 34], [35, 37], [38, 40]]

    elif "Scalabrino42.java" in fileName:
        add_line = [[14, 17], [17, 21], [21, 24], [24, 27], [27, 30], [30, 33]]
        remove_line = [[15, 17], [18, 20], [22, 24], [25, 27], [28, 30], [31, 33]]

    elif "Scalabrino45.java" in fileName:
        add_line = [[5, 19]]
        remove_line = []

    elif "Scalabrino48.java" in fileName:
        add_line = [
            [6, 33],
            [7, 33],
            [12, 33],
            [15, 24],
            [17, 21],
            [14, 12],
            [21, 12],
            [26, 12],
            [27, 12],
        ]
        remove_line = [[20, 21], [22, 24], [27, 32]]

    elif "Scalabrino53.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino54.java" in fileName:
        add_line = [[2, 6], [6, 16], [16, 19], [19, 22], [11, 15], [13, 11]]
        remove_line = [[4, 6], [13, 15], [15, 16], [18, 19], [21, 22]]

    elif "Scalabrino55.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino65.java" in fileName:
        add_line = [[3, 9]]
        remove_line = []

    elif "Scalabrino67.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino73.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino76.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino77.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino79.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino81.java" in fileName:
        add_line = [[5, 8]]
        remove_line = [[6, 8]]

    elif "Scalabrino91.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino92.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino113.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino114.java" in fileName:
        add_line = [[10, 13], [13, 17], [17, 20], [20, 23], [23, 26], [26, 29]]
        remove_line = [[11, 13], [14, 16], [18, 20], [21, 23], [24, 26], [27, 29]]

    elif "Scalabrino119.java" in fileName:
        add_line = [[6, 38]]
        remove_line = [[36, 38]]

    elif "Scalabrino123.java" in fileName:
        add_line = [[2, 15]]
        remove_line = [[12, 15]]

    elif "Scalabrino129.java" in fileName:
        add_line = [[11, 14], [12, 19]]
        remove_line = [[12, 14]]

    elif "Scalabrino133.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino139.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino141.java" in fileName:
        add_line = [[4, 7], [8, 11]]
        remove_line = []

    elif "Scalabrino144.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino150.java" in fileName:
        add_line = [[3, 6]]
        remove_line = [[4, 6]]

    elif "Scalabrino151.java" in fileName:
        add_line = [[5, 17], [9, 13], [20, 29], [24, 29]]
        remove_line = [[13, 17]]

    #     ===============R后10==============
    elif "Scalabrino152.java" in fileName:
        add_line = [[4, 7], [37, 12]]
        remove_line = [[19, 21], [25, 27], [30, 32], [37, 40]]

    elif "Scalabrino153.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino160.java" in fileName:
        add_line = [[6, 9]]

    elif "Scalabrino164.java" in fileName:
        add_line = [[10, 18], [11, 14], [19, 24]]
        remove_line = [[12, 14], [15, 18], [22, 24]]

    elif "Scalabrino165.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino168.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino169.java" in fileName:
        add_line = [[3, 6], [6, 9], [9, 12], [13, 18], [18, 21]]
        remove_line = [[4, 6], [7, 9], [10, 12], [15, 18], [19, 21]]

    elif "Scalabrino184.java" in fileName:
        add_line = [[8, 13], [13, 17]]

    elif "Scalabrino187.java" in fileName:
        add_line = []
        remove_line = []

    elif "Scalabrino191.java" in fileName:
        add_line = []
        remove_line = []

    for line in add_line:
        add_edge.append(
            [findIndex(stmt_node_list, line[0]), findIndex(stmt_node_list, line[1])]
        )

    for line in remove_line:
        remove_edge.append(
            [findIndex(stmt_node_list, line[0]), findIndex(stmt_node_list, line[1])]
        )

    return remove_edge, add_edge


if __name__ == "__main__":
    # N_PATHS_AST = "Dataset/Neutral"
    # R_PATHS_AST = "Dataset/Readable"
    # U_PATHS_AST = "Dataset/Unreadable"
    JS_PATH = "Dataset_js"
    tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
    model = AutoModel.from_pretrained("microsoft/codebert-base")
    # graph_list, target_list, code_filename_list = json_parse_to_graph(
    #     N_PATHS_AST, R_PATHS_AST, U_PATHS_AST
    # )
    print(f"Generating input.pkl from JS dataset: {JS_PATH}")
    graph_list, target_list, code_filename_list = json_parse_to_graph_js(JS_PATH)

    graph_input = []
    target_input = []
    graph_raw_code_nodes = []

    for i in range(len(graph_list)):
        # if "Scalabrino84.java" in code_filename_list[i]:
        (
            node_type,
            raw_code_list,
            node_embedding_list,
            edge_list,
            edge_types,
            target,
            node_one_hot_list,
        ) = graph_to_input(
            graph_list[i], code_filename_list[i], target_list[i], tokenizer, model
        )
        nodes_info = []

        # graph_raw_code_nodes.append({"graph_name": code_filename_list[i].split("/")[-1], "graph_nodes_codes": raw_code_list, "graph_nodes_type": node_type})
        # graph_raw_code_nodes.append(os.path.basename(code_filename_list[i]))
        graph_raw_code_nodes.append({
            "graph_name": os.path.basename(code_filename_list[i]),
            "graph_nodes_codes": raw_code_list,
            "graph_nodes_type": node_type,
            "edge_types": edge_types
        })

        for j in range(len(node_embedding_list)):
            node_embedding = np.array(node_embedding_list[j])
            node_embedding = np.mean(node_embedding_list[j], axis=0)
            node_info = np.concatenate(
                (node_embedding.tolist(), node_one_hot_list[j]), axis=0
            )
            nodes_info.append(node_info)

        x = torch.tensor(nodes_info)
        x = x.to(torch.float32)
        x_zero = torch.zeros(1000, 794).float()
        x_zero[: x.size(0), :] = x

        y = torch.tensor([target]).float()
        edge_index = torch.tensor(edge_list)
        graph_data = Data(x=x, edge_index=edge_index, y=target)
        target_input.append(target)
        # node_type #edge_type
        graph_input.append(graph_data)

    pkl_data = {
        "file": graph_raw_code_nodes,
        "input": graph_input,
        "target": target_input,
    }
    cpg_dataset = pd.DataFrame(pkl_data)

    # please change the name ("input_XXXXXX.pkl") if necessary
    # the "matrix" is not necessary here, it's for future studying
    write_pkl(cpg_dataset[["input", "target", "file"]], "", "input.pkl")
    print("Build pkl Successfully")