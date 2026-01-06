import csv
import os.path

import pandas as pd
import torch
import time
from torch.utils.data import DataLoader

from Code.configures import data_args, model_args
from Code.DMon import DMon
from Code.load_dataset import get_cross_dataloader
from load_dataset import CodeDataset

from .explainer.subgraphX import PlotUtils, SubgraphX, find_closest_node_result

from sklearn.metrics import classification_report, confusion_matrix

def DatasetLoading(pkl_path):
    """
    --- モジュール ---
    データセット（pklファイル）を読み込み、
    分類タスクで使用できるCodeDatasetオブジェクトを返します
    """
    print(f"Loading dataset from: {pkl_path}")
    pkl_file = pd.read_pickle(pkl_path)

    # graph_nameでソートして順序を確定させる
    pkl_file['sort_key'] = pkl_file['file'].apply(lambda x: x['graph_name'])
    pkl_file = pkl_file.sort_values(by='sort_key').reset_index(drop=True)

    input_file = pkl_file["input"]  # データセット - データファイル
    raw_file = pkl_file["file"]  # データセット - 生ファイル
    dataset = CodeDataset(input_file, raw_file)
    return dataset


def ModelLoading(model, device):
    """
    --- モジュール ---
    モデル（最高性能のGNNモデル）を読み込みます
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
    --- モジュール ---
    分類タスクのためにデータをモデルに入力します
    """
    # 各グラフを取得
    data_input, data_raw = dataset[graph_index]
    print("分析対象のデータ: ", data_raw["graph_name"])
    
    # 説明および可視化のためにグラフを選択
    probs, _ = model(data_input)
    # 予測結果を取得
    prediction = probs.squeeze().argmax(-1).item()

    probs_squeezed = probs.squeeze()
    prediction_score = probs_squeezed[0].item() * 1.0 + probs_squeezed[1].item() * 0.5 + probs_squeezed[2].item() * 0.0

    return prediction, prediction_score


def Explain(explainer, prediction, data, max_nodes):
    """
    --- モジュール ---
    explainerはGNNの予測に基づいて説明を提供します
    """
    _, explanation_results, related_preds = explainer(data, max_nodes=max_nodes)
    result = find_closest_node_result(
        explanation_results[prediction], max_nodes=max_nodes
    )
    # エッジリストを保存
    edge_list = []
    raw_egdeList = result.data.edge_index.numpy().tolist()
    for j in range(len(raw_egdeList[0])):
        edge_list.append((raw_egdeList[0][j], raw_egdeList[1][j]))

    return result, explanation_results, related_preds, edge_list


def ExposedSource(explaining_result, data_raw, edgeList, data_record):
    """
    --- モジュール ---
    説明（重要なインデックス、重要なエッジ、コードスニペット）を取得します
    """
    # すべての重要なエッジを検索
    node_code_info = data_raw["graph_nodes_codes"]
    CriticalEdges = []
    for n_frm, n_to in explaining_result.ori_graph.edges():
        if n_frm in explaining_result.coalition and n_to in explaining_result.coalition:
            if (
                n_frm < len(node_code_info) and n_to < len(node_code_info)
                and len(node_code_info[n_frm]) > 1
                and isinstance(node_code_info[n_frm][1], dict)
                and "beginLine" in node_code_info[n_frm][1]
                and len(node_code_info[n_to]) > 1
                and isinstance(node_code_info[n_to][1], dict)
                and "beginLine" in node_code_info[n_to][1]
            ):
                CriticalEdges.append(
                    (
                        node_code_info[n_frm][1]["beginLine"] ,
                        node_code_info[n_to][1]["beginLine"] ,
                    )
                )
            else:
                CriticalEdges.append((n_frm, n_to))
    CriticalEdgesRaw = [
        (n_frm, n_to)
        for (n_frm, n_to) in explaining_result.ori_graph.edges()
        if n_frm in explaining_result.coalition and n_to in explaining_result.coalition
    ]

    for criticalindex in range(len(CriticalEdges)):
        # すべてのエッジ内でのエッジのインデックスを検索
        index = edgeList.index(CriticalEdgesRaw[criticalindex])
        
        edge_type = "Unknown"
        if index < len(data_raw['edge_types']):
            edge_type = data_raw['edge_types'][index]
            
        print(f"{CriticalEdges[criticalindex]}, Type: {edge_type}")
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
    この関数はデータの各行を単一のCSVに書き込みます
    """
    # 必要に応じて切り替え
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
    説明のパイプライン全体。分類タスクはグラフに基づいています
    """

    # ----- モジュール: データセットの読み込み ------
    device = torch.device(
        "cuda:0" if torch.cuda.is_available() else "cpu"
    )  # デバイスの初期化
    root_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    dataset = DatasetLoading(os.path.join(root_dir, "input.pkl"))

    # ----- モジュール: 学習済みモデルの読み込み (主にhgcn, rgcnなど) ------
    # 1. モデルの作成
    gnnNets = DMon(data_args, model_args)
    # 2. 最高性能の状態を読み込み
    ModelLoading(gnnNets, device)

    # ----- モジュール: 分類タスクのためにグラフデータを学習済みモデルに入力 ------
    # 最終結果
    final_result = []

    # 指定某データディレクトリ（必要に応じて切り替え）
    data_dir = "Dataset_js"
    # data_dir = "Dataset/Readable"
    # data_dir = "Dataset/Neutral"
    # data_dir = "Dataset/Unreadable"

    data_record = []
    y_true_list = []#実際の正解
    y_pred_list = []#予測結果
    result_list = []#結果を格納するリスト

    label_mapping = {0: "readable", 1: "neutral", 2: "unreadable"} 

    # データセット内の200個のグラフをループ
    loader = DataLoader(dataset, batch_size=1, shuffle=False, collate_fn=lambda x: x[0])
    for i, (data_input, data_raw) in enumerate(loader):
        t_start_data = time.time()
        # 説明および可視化のためにグラフを選択
        if os.path.exists(os.path.join(data_dir, data_raw["graph_name"])):
            
            # ----- モジュール: 分類 ------
            prediction, prediction_score = Classification(gnnNets, dataset, i)
            # y_true_list.append(data_input.y.item())
            if hasattr(data_input.y, 'item'):
                y_true_list.append(data_input.y.item())
            else:
                y_true_list.append(data_input.y)
            y_pred_list.append(prediction)

            # 予測結果をリストに追加
            result_list.append({
                "name": data_raw["graph_name"],
                "label": label_mapping[prediction],
                "score": prediction_score
            })

            #予測結果に応じて保存先ディレクトリを設定
            is_js_file = data_raw["graph_name"].endswith(".js")

            if prediction == 2:
                print("------ モデルの予測結果：unreadable ------")
                if is_js_file:
                    save_dir = os.path.join("newResults_js", "Unreadable")
                else:
                    save_dir = os.path.join("newResults", "unreadable")
            elif prediction == 1:
                print("------ モデルの予測結果：neutral ------")
                if is_js_file:
                    save_dir = os.path.join("newResults_js", "Neutral")
                else:
                    save_dir = os.path.join("newResults", "neutral")
            elif prediction == 0:
                print("------ モデルの予測結果：readable ------")
                if is_js_file:
                    save_dir = os.path.join("newResults_js", "Readable")
                else:
                    save_dir = os.path.join("newResults", "readable")
            print(f"予測スコア: {prediction_score:.4f}")

            if not os.path.exists(save_dir):
                os.makedirs(save_dir)

             # ----- モジュール: explainerの読み込み ------
            explainer = SubgraphX(
                gnnNets,
                num_classes=3,
                device=device,
                explain_graph=False,
                reward_method="mc_l_shapley",
                save_dir=save_dir,
                filename=data_raw["graph_name"],
                rollout=10,        # デフォルト20 -> 10 (探索回数を減らす)
                sample_num=50,     # デフォルト100 -> 50 (サンプリング数を減らす)
                expand_atoms=10,   # デフォルト14 -> 10 (分岐数を減らす)
            )

            # ----- モジュール: 説明 ------
            max_node = data_input.num_nodes // 2
            explaining_result, results, related_preds, edge_list = Explain(
                explainer, prediction, data_input, max_node
            )
            final_result.append(related_preds[prediction])

            # ----- モジュール: 可視化 ------
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

            # ----- モジュール: ソースコードの公開 ------
            ExposedSource(explaining_result, data_raw, edge_list, data_record)
            t_end_data = time.time()
            print(f"処理にかかった時間({data_raw['graph_name']}): {t_end_data - t_start_data:.3f} 秒")
            print("")
    
    sorted_results = sorted(result_list, key=lambda x: x['score'], reverse=True)
    print("----- モデルの予測結果一覧 (スコア順) -----")
    print("ファイル名, 予測結果, 予測スコア")
    for res in sorted_results:
        print(f"{sorted_results.index(res)+1}. {res['name']}, {res['label']}, {res['score']:.4f}")

    # ----- モジュール: 分類レポートの生成 ------
    '''
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
    '''

    return data_record


if __name__ == "__main__":
    # max nodesはグラフ内の重要なノードを制御します
    data_record = ExplainingPipeline()
    recordInCSV(data_record)
    print("ok!")