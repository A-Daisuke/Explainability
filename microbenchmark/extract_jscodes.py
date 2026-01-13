import json
import random
import os

def count_lines(text):
    """テキストの行数をカウントする関数"""
    if not text:
        return 0
    return len(text.splitlines())

def add_indent(text, indent_level=8):
    """
    各行の先頭に指定した数のスペースを追加する関数。
    空行にはスペースを追加しません。
    """
    if not text:
        return ""
    
    indent_str = " " * indent_level
    lines = text.splitlines()
    # 行に中身がある場合のみインデントを付与
    indented_lines = [indent_str + line if line.strip() else line for line in lines]
    return "\n".join(indented_lines)

def extract_filtered_js_pairs(input_file, output_dir, num_pairs=200, min_lines=10):
    # 出力先ディレクトリの作成
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"ディレクトリ '{output_dir}' を作成しました。")

    # JSON読み込み
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"エラー: ファイル '{input_file}' が見つかりません。")
        return

    total_items = len(data)
    print(f"全データ数: {total_items} ペア")

    # --- フィルタリング処理 ---
    # slowとfastの両方が min_lines 以上のペアのみを抽出
    filtered_pairs = [
        pair for pair in data
        if count_lines(pair.get('slow', '')) >= min_lines and 
           count_lines(pair.get('fast', '')) >= min_lines
    ]
    
    filtered_count = len(filtered_pairs)
    print(f"条件（{min_lines}行以上）を満たすデータ数: {filtered_count} ペア")

    if filtered_count == 0:
        print("条件を満たすデータが見つかりませんでした。")
        return

    # ランダムサンプリング
    if filtered_count < num_pairs:
        print(f"警告: 条件を満たすデータ数が要求数({num_pairs})未満です。あるだけ全て抽出します。")
        sample_pairs = filtered_pairs
    else:
        sample_pairs = random.sample(filtered_pairs, num_pairs)

    # --- ラッパー定義 ---
    # ヘッダー（run: function() { の次は改行されているため、ここにはインデント不要）
    wrapper_header = "const Benchmark = {\n    run: function() {\n"
    # フッター
    wrapper_footer = "\n    }\n};"

    # ファイル書き出し
    for pair in sample_pairs:
        pair_id = pair.get('id', 'unknown')
        # slowコード
        slow_code = pair.get('slow', '')
        indented_slow = add_indent(slow_code, indent_level=8) # 8スペース下げる
        wrapped_slow_code = wrapper_header + indented_slow + wrapper_footer

        slow_filename = f"pair_{pair_id}_slow.js"
        with open(os.path.join(output_dir, slow_filename), 'w', encoding='utf-8') as f:
            f.write(wrapped_slow_code)
        
        # fastコード
        fast_code = pair.get('fast', '')
        indented_fast = add_indent(fast_code, indent_level=8) # 8スペース下げる
        wrapped_fast_code = wrapper_header + indented_fast + wrapper_footer
        
        fast_filename = f"pair_{pair_id}_fast.js"
        with open(os.path.join(output_dir, fast_filename), 'w', encoding='utf-8') as f:
            f.write(wrapped_fast_code)

    print(f"抽出完了: 合計 {len(sample_pairs) * 2} 個のファイルを '{output_dir}' に保存しました。")

# --- 設定 ---
INPUT_FILE = 'mb_speed_diff_sort.json'
OUTPUT_DIR = 'extracted_js_10lines'  # 分かりやすくフォルダ名を変更しています
NUM_PAIRS = 100
MIN_LINES = 10

if __name__ == "__main__":
    extract_filtered_js_pairs(INPUT_FILE, OUTPUT_DIR, NUM_PAIRS, MIN_LINES)