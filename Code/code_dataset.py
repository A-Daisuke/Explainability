import glob
import json
import os.path
import re
import sys

import numpy as np
print(f"Numpy version: {np.__version__}")
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

"""
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
    "CommentLine": "LineComment",
    "FunctionExpression": "MethodDeclaration" 
}
"""
babel_mapping = {
# --- 文 (Statements) -> 簡略化された型へ ---
    "BlockStatement": "BlockStmt",
    "ExpressionStatement": "ExpressionStmt",
    "IfStatement": "IfStmt",
    "ReturnStatement": "ReturnStmt",
    "WhileStatement": "WhileStmt",
    "ForStatement": "ForStmt",
    "DoWhileStatement": "DoStmt",
    "SwitchStatement": "SwitchStmt",
    "SwitchCase": "SwitchEntry",
    "BreakStatement": "BreakStmt",
    "ContinueStatement": "ContinueStmt",
    "TryStatement": "TryStmt",
    "ThrowStatement": "ThrowStmt",
    "CatchClause": "CatchStmt", # JavaParserのCatchStmtに対応
    
    # --- 関数定義 (MethodDeclarationとして扱う) ---
    "FunctionDeclaration": "MethodDeclaration",
    "FunctionExpression": "MethodDeclaration",
    "ArrowFunctionExpression": "MethodDeclaration",
    "ClassMethod": "MethodDeclaration",

    # --- データフロー解析用 (表示はされないがグラフ構築に必要) ---
    "VariableDeclaration": "ExpressionStmt",          # 文として表示させる
    "VariableDeclarator": "VariableDeclarationExpr",  # データフロー解析用
    "Identifier": "NameExpr",                         # 変数使用の追跡用
    "CommentLine": "LineComment",
    "CommentBlock": "BlockComment",
    
    # --- その他、必要であれば ---
    # "Program": "CompilationUnit", 

    # --- 削除するもの (Javaと同様にするためノード化しない) ---
    # "BinaryExpression", "CallExpression", "AssignmentExpression",
    # "MemberExpression", "UnaryExpression", "UpdateExpression",
    # "NewExpression", "ArrayExpression", "ObjectExpression",
    # "NumericLiteral", "StringLiteral", "BooleanLiteral", "NullLiteral",
    # "VariableDeclarator" (親のVariableDeclarationでカバーするため不要)
    # "ClassDeclaration" (JavaではMethodの中身を見ているためClass自体はノード化しないことが多い)
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
            # If mapping fails, try to use node_type directly or skip
            # For now, let's skip unknown types to avoid errors, or map to ExpressionStmt if it looks like stmt?
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
        # Fallback for JS types if mapping missed something or if we want to be safe
        return list(np.zeros(len(hot_dict.keys()), dtype=int))

    index = hot_dict[node_type]
    all_zero = np.zeros(len(hot_dict.keys()), dtype=int)
    node_type_one_hot = all_zero.copy()
    node_type_one_hot[index] = 1
    # print(node_type_one_hot)
    return list(node_type_one_hot)


def get_directory_files(directory):
    return sorted([os.path.basename(file) for file in glob.glob(f"{directory}/*.json")])


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

    Node_type = []
    Node_range = []

    def loopKeys(graph, key):
        if isinstance(graph[key], list):
            for item in graph[key]:
                createGraph(item, key)
        elif isinstance(graph[key], dict):
            createGraph(graph[key], key)

    def createGraph(graph, name):
        if "!" in graph.keys():
            noneName = graph["!"]
            if '.' in noneName:
                noneName = noneName.split(".")[-1]

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
                if name == "elseStmt":
                    noneName = "ElseIfStmt"

                then_range = graph["thenStmt"]["range"]
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

    return {"node_type": Node_type, "node_range": Node_range}


def json_parse_to_graph_js(JS_PATH):
    dataset_files = get_directory_files(JS_PATH)
    dataset_files.sort()
    # dataset_files = dataset_files[:50]
    
    graph_list = []
    target_list = []
    code_filename_list = []

    for json_file in dataset_files:
        with open(os.path.join(JS_PATH, json_file)) as f:
            print(json_file)
            content = json.load(f)
            graph = ConvertBabelToGraph(content)
            graph_list.append(graph)
            target_list.append(0) 
            code_filename_list.append(
                os.path.join(JS_PATH, json_file.replace(".json", ".js"))
            )

    return graph_list, target_list, code_filename_list

def graph_to_input(graph, fileName, target, tokenizer, model):
    node_type = graph["node_type"]
    node_range = graph["node_range"]

    # Always rebuild edges to ensure indices match the filtered node list (node_stmt_list)
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
                    re.split(r' |\.|\ |\]|\(|\ |\[|\]|\=|,|"', "".join(code)),
                ]
            )

        elif "VariableDeclarationExpr" in node_type[i] or node_type[i] == "Parameter":
            node_declaration_list.append(
                [
                    node_type[i],
                    node_range[i],
                    re.split(r' |\.|\ |\]|\(|\ |\[|\]|\=|,|"', "".join(code)),
                ]
            )

        else:
            node_stmt_list.append([node_type[i], node_range[i], nl, code])

    node_declaration_list.sort(
        key=lambda x: (x[1]["beginLine"], -int(x[1]["endLine"]), 
        x[1]["endColumn"])
    )
    node_assign_list.sort(
        key=lambda x: (x[1]["beginLine"], -int(x[1]["endLine"]), 
        x[1]["endColumn"])
    )
    node_stmt_list.sort(
        key=lambda x: (x[1]["beginLine"], -int(x[1]["endLine"]), 
        x[1]["endColumn"])
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

    # Manual control flow adjustment skipped for now

    for line in control_line_list:
        edge_list[0].append(findIndex(node_stmt_list, line[0]))
        edge_list[1].append(findIndex(node_stmt_list, line[1]))
        edge_types.append("Control")

    # ADD Data FLOWS
    data_edge_list = DataEdgeHandle(node_declaration_list, node_assign_list)
    for line in data_edge_list:
        edge_list[0].append(findIndex(node_stmt_list, line[0]))
        edge_list[1].append(findIndex(node_stmt_list, line[1]))
        edge_types.append("Data")

    # ADD AST FLOWS (For all files)
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
    node_embedding_list_ret = []
    node_one_hot_list_ret = []
    node_types_list = []
    raw_codes_list = []

    for i in range(len(node_stmt_list)):
        node_emb = codeEmbedding(
            node_stmt_list[i][2], node_stmt_list[i][3], tokenizer, model
        )
        node_embedding_list_ret.append(node_emb)
        node_one_hot_list_ret.append(one_hot_node_type(node_stmt_list[i][0]))
        node_types_list.append(node_stmt_list[i][0])
        raw_codes_list.append(node_stmt_list[i][2] + node_stmt_list[i][3])
        
    return (
        node_types_list,
        node_stmt_list,
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


if __name__ == "__main__":
    #change!!!
    # N_PATHS_AST = "Dataset/Neutral"
    # R_PATHS_AST = "Dataset/Readable"
    # U_PATHS_AST = "Dataset/Unreadable"
    script_dir = os.path.dirname(os.path.abspath(__file__))
    #JS_PATH = os.path.join(script_dir, "../Dataset_js")
    JS_PATH = os.path.join(script_dir, "../Dataset_js_repository")
    
    tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
    model = AutoModel.from_pretrained("microsoft/codebert-base")
    print(f"Generating input.pkl from JS dataset: {JS_PATH}")
    if not os.path.exists(JS_PATH):
        print(f"Error: Directory {JS_PATH} does not exist.")
    else:
        graph_list, target_list, code_filename_list = json_parse_to_graph_js(JS_PATH)

        graph_input = []
        target_input = []
        graph_raw_code_nodes = []

        for i in range(len(graph_list)):
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

            graph_raw_code_nodes.append({
                "graph_name": os.path.basename(code_filename_list[i]),
                "graph_nodes_codes": raw_code_list,
                "graph_nodes_type": node_type,
                "edge_types": edge_types
            })

            for j in range(len(node_embedding_list)):
                node_embedding = np.array(node_embedding_list[j])
                if node_embedding.size > 0:
                    node_embedding = np.mean(node_embedding, axis=0)
                else:
                    node_embedding = np.zeros(768) # Fallback if no tokens
                    
                node_info = np.concatenate(
                    (node_embedding.tolist(), node_one_hot_list[j]), axis=0
                )
                nodes_info.append(node_info)

            if len(nodes_info) == 0:
                print(f"Warning: No nodes found for {code_filename_list[i]}")
                x = torch.zeros(1, 794).float() # Dummy node
            else:
                # Optimize: convert list of arrays to single array first
                x_np = np.array(nodes_info, dtype=np.float32)
                x = torch.from_numpy(x_np)
            

            y = torch.tensor([target], dtype=torch.float)
            edge_index = torch.tensor(edge_list, dtype=torch.long)
            graph_data = Data(x=x, edge_index=edge_index, y=y)
            target_input.append(target)
            graph_input.append(graph_data)

        pkl_data = {
            "file": graph_raw_code_nodes,
            "input": graph_input,
            "target": target_input,
        }
        cpg_dataset = pd.DataFrame(pkl_data)

        # please change the name ("input_XXXXXX.pkl") if necessary
        # the "matrix" is not necessary here, it's for future studying
        root_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
        write_pkl(cpg_dataset[["input", "target", "file"]], root_path + "/", "input.pkl")
        print(f"Build pkl Successfully. Total graphs: {len(graph_input)}")
        
        # Verification
        try:
            print("Verifying input.pkl...")
            pd.read_pickle("input.pkl")
            print("Verification successful: input.pkl is readable.")
        except Exception as e:
            print(f"Verification FAILED: {e}")
            sys.exit(1)
