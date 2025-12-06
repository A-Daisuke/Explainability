import csv
import os.path

import pandas as pd
import torch

from Code.configures import data_args, model_args
from Code.DMon import DMon
from Code.load_dataset import get_cross_dataloader
from load_dataset import CodeDataset

from .explainer.subgraphX import PlotUtils, SubgraphX, find_closest_node_result

from sklearn.metrics import classification_report, confusion_matrix

def DatasetLoading(pkl_path):
    """
    --- module ---
    load dataset (pkl file),
    return a CodeDataset object,
    which can be used in classification task
    """
    pkl_file = pd.read_pickle(pkl_path)
    input_file = pkl_file["input"]  # dataset - data file
    raw_file = pkl_file["file"]  # dataset - raw file
    dataset = CodeDataset(input_file, raw_file)
    return dataset


def ModelLoading(model, device):
    """
    --- module ---
    load model (gnn model with the best performance)
    """
    checkpoint_best = torch.load(
        os.path.join("Code", "checkpoint", "code_hh", "dmon_best_2.pth"),
        weights_only=False,
    )
    model.update_state_dict(checkpoint_best["net"])
    model.to(device)
    model.eval()


def Classification(model, dataset, graph_index):
    """
    --- module ---
    feed data into model for classification task
    """
    # get each graph
    data_input, data_raw = dataset[graph_index]
    print("Explaining graph: ", data_raw["graph_name"])

    # 选择图进行解释以及可视化
    probs, _ = model(data_input)
    # get prediction result
    prediction = probs.squeeze().argmax(-1).item()

    return prediction


def Explain(explainer, prediction, data, max_nodes):
    """
    --- module ---
    explainer gives explanation based on prediction of gnn
    """
    _, explanation_results, related_preds = explainer(data, max_nodes=max_nodes)
    result = find_closest_node_result(
        explanation_results[prediction], max_nodes=max_nodes
    )
    # store edge list
    edge_list = []
    raw_egdeList = result.data.edge_index.numpy().tolist()
    for j in range(len(raw_egdeList[0])):
        edge_list.append((raw_egdeList[0][j], raw_egdeList[1][j]))

    return result, explanation_results, related_preds, edge_list


def ExposedSource(explaining_result, data_raw, edgeList, data_record):
    """
    --- module ---
    get explanations: important index, important edges, code snippets
    """
    # find all the critical nodes and code snippets
    # for importantIndex in explaining_result.coalition:
    #     print("(", importantIndex, ")", end="\n")
    #     for element in range(2, 4):
    #         for step_find in range(len(data_raw["graph_nodes_codes"][int(importantIndex)][element])):
    #             print('\033[0:34m' + data_raw["graph_nodes_codes"][int(importantIndex)][element][step_find] + '\033[m')
    # find all the critical edges
    node_code_info = data_raw["graph_nodes_codes"]
    CriticalEdges = []
    for n_frm, n_to in explaining_result.ori_graph.edges():
        if n_frm in explaining_result.coalition and n_to in explaining_result.coalition:
            if (
                len(node_code_info[n_frm]) > 1
                and isinstance(node_code_info[n_frm][1], dict)
                and "beginLine" in node_code_info[n_frm][1]
                and len(node_code_info[n_to]) > 1
                and isinstance(node_code_info[n_to][1], dict)
                and "beginLine" in node_code_info[n_to][1]
            ):
                CriticalEdges.append(
                    (
                        node_code_info[n_frm][1]["beginLine"] - 1,
                        node_code_info[n_to][1]["beginLine"] - 1,
                    )
                )
            else:
                CriticalEdges.append((n_frm, n_to))
    CriticalEdgesRaw = [
        (n_frm, n_to)
        for (n_frm, n_to) in explaining_result.ori_graph.edges()
        if n_frm in explaining_result.coalition and n_to in explaining_result.coalition
    ]
    # for EdgeTuple1, index in zip(edgeList, range(len(edgeList))):
    #     for CriticalTuple in CriticalEdges:
    #         EdgeTupleConfer = (node_code_info[EdgeTuple1[0]][1]['beginLine'], node_code_info[EdgeTuple1[1]][1]['beginLine'])
    #         if operator.eq(EdgeTupleConfer, CriticalTuple):
    #             print(EdgeTupleConfer, " index: ", index, " Type: ", data_raw['edge_types'][index])
    for criticalindex in range(len(CriticalEdges)):
        # find index of edge in all edges
        index = edgeList.index(CriticalEdgesRaw[criticalindex])
        print(f"{CriticalEdges[criticalindex]}, Type: {data_raw['edge_types'][index]}")
    row_data = [
        data_raw["graph_name"],
        len(node_code_info),
        len(edgeList),
        len(explaining_result.coalition),
        len(CriticalEdges),
    ]
    data_record.append(row_data)
    print(
        "Nodes: ",
        len(node_code_info),
        "; ",
        "Edges: ",
        len(edgeList),
        "; ",
        "Critical Nodes: ",
        len(explaining_result.coalition),
        "; ",
        "Critical Edges: ",
        len(CriticalEdges),
    )


def recordInCSV(data_record):
    """
    this function writes each row of data into a single csv
    """
    #change!!!
    file_path = "statistics_readable.csv"
    #file_path = "statistics_neutral.csv"
    #file_path = "statistics_unreadable.csv"

    file_exists = os.path.exists(file_path)
    with open(file_path, mode="w", newline="") as f:
        writer = csv.writer(f)

        if not file_exists or os.path.getsize(file_path) == 0:
            writer.writerow(
                [
                    "Graph Name",
                    "Num of Nodes",
                    "Num of Edges",
                    "Num of Critical Nodes",
                    "Num of Critical Edges",
                ]
            )
        for row in data_record:
            writer.writerow(row)
    print(f"Data written to {file_path}")


def ExplainingPipeline():
    """
    the entire pipeline of explanation; the classification task is based on graph
    """

    # ----- module: load dataset ------
    device = torch.device(
        "cuda:0" if torch.cuda.is_available() else "cpu"
    )  # initialize device
    dataset = DatasetLoading("input.pkl")

    # ----- module: load trained model (mainly hgcn, rgcn or ...) ------
    # 1. create model
    gnnNets = DMon(data_args, model_args)
    # 2. load best performance state
    ModelLoading(gnnNets, device)
    # save final result
    #save_dir = os.path.join("newResults", "readable")
    #if not os.path.isdir(save_dir):
    #    os.mkdir(save_dir)

    # ----- 回避训练用的数据集，打开训练数据集看看哪些是被用于训练的 ------
    dataloader_list, dataloaderfull_list = get_cross_dataloader(data_args)
    # 选第几折
    dataloader_exposed = dataloaderfull_list[1]
    train_graphs_set = set()
    for train_graph in dataloader_exposed["train"]:
        for graph in train_graph["graph_name"]:
            train_graphs_set.add(graph)

    # ----- module: feed graph data into trained model for classification task ------
    # final result
    final_result = []

    # 指定某图
    # data_name = "Scalabrino125.java"
    #change!!!
    data_dir = "Dataset_js"
    # data_dir = "Dataset/Readable"
    #data_dir = "Dataset/Neutral"
    #data_dir = "Dataset/Unreadable"

    # 判断选择图是否是训练集中的图数据
    # if data_name in train_graphs_set:
    #     print("------ This graph is in training set ------")
    # else:
    #     print("------ This graph is not in training set ------")

    data_record = []
    y_true_list = []#実際の正解
    y_pred_list = []#予測結果
    # loop 200 graphs in the dataset
    for i in range(len(dataset)):
        # get each graph
        data_input, data_raw = dataset[i]
        # 选择图进行解释以及可视化
        if os.path.exists(os.path.join(data_dir, data_raw["graph_name"])):
            if data_raw["graph_name"] in train_graphs_set:
                print("------ This graph is in training set ------")
            else:
                print("------ This graph is not in training set ------")
            # ----- module: load explainer ------
            #explainer = SubgraphX(
            #    gnnNets,
            #    num_classes=3,
            #    device=device,
            #    explain_graph=False,
            #    reward_method="mc_l_shapley",
            #    save_dir=save_dir,
            #   filename=data_raw["graph_name"],
            #)

            # ----- module: classification ------
            prediction = Classification(gnnNets, dataset, i)
            # y_true_list.append(data_input.y.item())
            if hasattr(data_input.y, 'item'):
                y_true_list.append(data_input.y.item())
            else:
                y_true_list.append(data_input.y)
            y_pred_list.append(prediction)

            #予測結果に応じて保存先ディレクトリを設定
            is_js_file = data_raw["graph_name"].endswith(".js")

            if prediction == 2:
                print("------ Model believe it is unreadable ------")
                if is_js_file:
                    save_dir = os.path.join("newResults_js", "Unreadable")
                else:
                    save_dir = os.path.join("newResults", "unreadable")
            elif prediction == 1:
                print("------ Model believe it is neutral ------")
                if is_js_file:
                    save_dir = os.path.join("newResults_js", "Neutral")
                else:
                    save_dir = os.path.join("newResults", "neutral")
            elif prediction == 0:
                print("------ Model believe it is readable ------")
                if is_js_file:
                    save_dir = os.path.join("newResults_js", "Readable")
                else:
                    save_dir = os.path.join("newResults", "readable")

            if not os.path.exists(save_dir):
                os.makedirs(save_dir)

             # ----- module: load explainer ------
            explainer = SubgraphX(
                gnnNets,
                num_classes=3,
                device=device,
                explain_graph=False,
                reward_method="mc_l_shapley",
                save_dir=save_dir,
                filename=data_raw["graph_name"],
            )
            # 目前只考虑对unreadable数据集中的图解释
            #if prediction == 2:
            #    print("------ Model believe it is unreadable ------")
            #elif prediction == 1:
            #    print("------ Model believe it is neutral ------")
            #elif prediction == 0:
            #    print("------ Model believe it is readable ------")

            # ----- module: explain ------
            max_node = data_input.num_nodes // 2
            explaining_result, results, related_preds, edge_list = Explain(
                explainer, prediction, data_input, max_node
            )
            final_result.append(related_preds[prediction])

            # ----- module: visualization ------
            plotutils = PlotUtils(dataset_name="code_readability")
            explainer.visualization(
                results,
                prediction=prediction,
                max_nodes=max_node,
                plot_utils=plotutils,
                data_raw=data_raw,
                edge_list=edge_list,
                save_dir=save_dir,
            )

            # ----- module: expose source code ------
            ExposedSource(explaining_result, data_raw, edge_list, data_record)

    target_names = ['readable', 'neutral', 'unreadable']
    print("\n" + "="*30 + "\n")
    print("---混合行列---")
    cm = confusion_matrix(y_true_list, y_pred_list, labels=[0, 1, 2])
    print(cm)
    if cm.shape == (3, 3):
        # 0: readable (高い), 1: neutral (低い), 2: unreadable (低い)
        
        if data_dir == "Dataset/Readable":
            print("Readableのデータのみ分類")
            # 1. 可読性高い（正解）: 正解=0, 予測=0
            cat1 = cm[0, 0]
            # 2. 可読性高いを中間と分類: 正解=0, 予測=1
            cat2 = cm[0, 1]
            # 3. 可読性高いを低いと分類: 正解=0, 予測=2
            cat3 = cm[0, 2]
            print(f"1. 可読性高いと分類（正解）:{cat1}")
            print(f"2. 可読性中間と分類　　　　:{cat2}")
            print(f"3. 可読性低いと分類　　　　:{cat3}")


        elif data_dir == "Dataset/Neutral":
            print("Neutralのデータのみ分類")
            # 1. 可読性中間を高いと分類: 正解=1, 予測=0
            cat1 = cm[1, 0]
            # 2. 可読性中間（正解）: 正解=1, 予測=1
            cat2 = cm[1, 1]
            # 3. 可読性中間を低いと分類: 正解=1, 予測=2
            cat3 = cm[1, 2]
            print(f"1. 可読性高いと分類　　　　:{cat1}")
            print(f"2. 可読性中間と分類（正解）:{cat2}")
            print(f"3. 可読性低いと分類　　　　:{cat3}")

        elif data_dir == "Dataset/Unreadable":
            print("Unreadableのデータのみ分類")
            # 1. 可読性低いを高いと分類: 正解=2, 予測=0
            cat1 = cm[2, 0]
            # 2. 可読性低いを中間と分類: 正解=2, 予測=1
            cat2 = cm[2, 1]
            # 3. 可読性低い（正解）: 正解=2, 予測=2
            cat3 = cm[2, 2]
            print(f"1. 可読性高いと分類　　　　:{cat1}")
            print(f"2. 可読性中間と分類　　　　:{cat2}")
            print(f"3. 可読性低いと分類（正解）:{cat3}")
        
        elif data_dir == "Dataset_js":
            print("Dataset_jsのデータ分類 (ラベルなし/仮ラベル)")
            # JS data might not have true labels, so confusion matrix might not be meaningful purely for accuracy
            # But we can print what the model predicted
            print(cm)

    print("\n---精度レポート---")
    print(
        classification_report(
            y_true_list,
            y_pred_list,
            labels=[0, 1, 2],
            target_names=target_names,
            zero_division=0,
        )
    )
    print("=" * 30 + "\n")

    return data_record


if __name__ == "__main__":
    # max nodes control the critical nodes in the graph
    data_record = ExplainingPipeline()
    #delete'#'
    recordInCSV(data_record)
    print("ok!")