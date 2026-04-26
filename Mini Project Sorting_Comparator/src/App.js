import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ALGO_COLORS = {
  bubble:    { accent: "#944444", light: "#F9F5F5", text: "#632C2C" },
  
  selection: { accent: "#B38641", light: "#FAF7F2", text: "#6B4D21" },
  
  insertion: { accent: "#6B8E6B", light: "#F4F7F4", text: "#3D523D" },
  
  merge:     { accent: "#5A7DA3", light: "#F2F5F8", text: "#324B66" },
  
  quick:     { accent: "#7C77A3", light: "#F3F2F7", text: "#464166" },
  
  heap:      { accent: "#A36B7F", light: "#F8F3F5", text: "#613D49" },
};

const ALGO_ICONS = {
  bubble: "◎", selection: "◈", insertion: "⇅", merge: "⇄", quick: "◆", heap: "⬡",
};

const ALGO_LABELS = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
  heap: "Heap Sort",
};

const App = () => {
  const [input, setInput] = useState("64, 34, 25, 12, 22, 11, 90");
  const [stats, setStats] = useState({});
  const [algorithms, setAlgorithms] = useState({
    bubble: true, selection: true, insertion: true,
    merge: true, quick: true, heap: true,
  });

  const parseInput = (str) =>
    str.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));

  const bubbleSort = (arr) => {
    let a = [...arr], comparisons = 0, swaps = 0;
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < a.length - i - 1; j++) {
        comparisons++;
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; }
      }
    return { sortedArray: a, comparisons, swaps };
  };

  const selectionSort = (arr) => {
    let a = [...arr], comparisons = 0, swaps = 0;
    for (let i = 0; i < a.length; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) { comparisons++; if (a[j] < a[min]) min = j; }
      if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; swaps++; }
    }
    return { sortedArray: a, comparisons, swaps };
  };

  const insertionSort = (arr) => {
    let a = [...arr], comparisons = 0, swaps = 0;
    for (let i = 1; i < a.length; i++) {
      let key = a[i], j = i - 1;
      while (j >= 0 && a[j] > key) { comparisons++; a[j + 1] = a[j]; swaps++; j--; }
      if (j >= 0) comparisons++;
      a[j + 1] = key;
    }
    return { sortedArray: a, comparisons, swaps };
  };

  const mergeSort = (arr) => {
    let comparisons = 0, swaps = 0;
    const merge = (left, right) => {
      let result = [], i = 0, j = 0;
      while (i < left.length && j < right.length) {
        comparisons++;
        result.push(left[i] < right[j] ? left[i++] : right[j++]);
        swaps++;
      }
      return result.concat(left.slice(i)).concat(right.slice(j));
    };
    const sort = (a) => {
      if (a.length <= 1) return a;
      const mid = Math.floor(a.length / 2);
      return merge(sort(a.slice(0, mid)), sort(a.slice(mid)));
    };
    return { sortedArray: sort(arr), comparisons, swaps };
  };

  const quickSort = (arr) => {
    let comparisons = 0, swaps = 0;
    const sort = (a) => {
      if (a.length <= 1) return a;
      let pivot = a[a.length - 1], left = [], right = [];
      for (let i = 0; i < a.length - 1; i++) {
        comparisons++;
        (a[i] < pivot ? left : right).push(a[i]);
        swaps++;
      }
      return [...sort(left), pivot, ...sort(right)];
    };
    return { sortedArray: sort(arr), comparisons, swaps };
  };

  const heapSort = (arr) => {
    let a = [...arr], comparisons = 0, swaps = 0;
    const heapify = (n, i) => {
      let largest = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n) { comparisons++; if (a[l] > a[largest]) largest = l; }
      if (r < n) { comparisons++; if (a[r] > a[largest]) largest = r; }
      if (largest !== i) { [a[i], a[largest]] = [a[largest], a[i]]; swaps++; heapify(n, largest); }
    };
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a.length, i);
    for (let i = a.length - 1; i > 0; i--) { [a[0], a[i]] = [a[i], a[0]]; swaps++; heapify(i, 0); }
    return { sortedArray: a, comparisons, swaps };
  };

  const runSorting = () => {
    const arr = parseInput(input);
    if (!arr.length) return;
    const results = {};
    if (algorithms.bubble)    results.bubble    = bubbleSort(arr);
    if (algorithms.selection) results.selection = selectionSort(arr);
    if (algorithms.insertion) results.insertion = insertionSort(arr);
    if (algorithms.merge)     results.merge     = mergeSort(arr);
    if (algorithms.quick)     results.quick     = quickSort(arr);
    if (algorithms.heap)      results.heap      = heapSort(arr);
    setStats(results);
  };

  const resetAll = () => {
    setStats({});
    setInput("64, 34, 25, 12, 22, 11, 90");
    setAlgorithms({ bubble: true, selection: true, insertion: true, merge: true, quick: true, heap: true });
  };

  const graphData = Object.entries(stats).map(([name, data]) => ({
    name: ALGO_LABELS[name],
    comparisons: data.comparisons,
    swaps: data.swaps,
  }));

  const hasResults = Object.keys(stats).length > 0;

  return (
    <div style={styles.root}>

      <div style={styles.header}>
        <h1 style={styles.title}>Sorting Algorithm Comparator</h1>
        <p style={styles.subtitle}>Compare different sorting algorithms based on comparisons and swaps</p>
      </div>

      <div style={styles.controlBar}>

        <div style={styles.controlSection}>
          <span style={styles.controlLabel}>Input Array</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            placeholder="e.g. 64, 34, 25"
          />
          <span style={styles.inputHint}>Enter numbers separated by commas</span>
        </div>


        <div style={styles.controlSection}>
          <span style={styles.controlLabel}>Select Algorithms</span>
          <div style={styles.chipsRow}>
            {Object.keys(algorithms).map((key) => {
              const on = algorithms[key];
              const col = ALGO_COLORS[key];
              return (
                <button
                  key={key}
                  onClick={() => setAlgorithms({ ...algorithms, [key]: !on })}
                  style={{
                    ...styles.chip,
                    background: on ? col.light : "transparent",
                    color: on ? col.text : "#888",
                    borderColor: on ? col.accent : "#ddd",
                  }}
                >
                  <span style={{ ...styles.chipDot, background: on ? col.accent : "#ccc" }} />
                  {ALGO_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.actionsCol}>
          <span style={styles.controlLabel}>Actions</span>
          <button onClick={runSorting} style={styles.btnRun}>▶ Run</button>
          <button onClick={resetAll} style={styles.btnReset}>↺ Reset</button>
        </div>
      </div>

      {hasResults && (
        <>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>▤</span>
            <div>
              <div style={styles.sectionTitle}>Results</div>
              <div style={styles.sectionSub}>Performance comparison of selected algorithms</div>
            </div>
          </div>

          <div style={styles.grid}>
            {Object.entries(stats).map(([key, data]) => {
              const col = ALGO_COLORS[key];
              return (
                <div key={key} style={{ ...styles.resultCard, borderColor: col.accent }}>
                  <div style={styles.cardHeader}>
                    <div style={{ ...styles.iconBox, background: col.light }}>
                      <span style={{ color: col.accent, fontSize: 16 }}>{ALGO_ICONS[key]}</span>
                    </div>
                    <div>
                      <div style={{ ...styles.cardTitle, color: col.text }}>{ALGO_LABELS[key]}</div>
                      <div style={styles.cardSub}>Sorted Array</div>
                    </div>
                  </div>

                  <div style={styles.sortedBox}>{data.sortedArray.join(", ")}</div>

                  <div style={styles.statsRow}>
                    <div style={styles.statBox}>
                      <div style={styles.statLabel}>Comparisons</div>
                      <div style={{ ...styles.statVal, color: col.text }}>{data.comparisons}</div>
                    </div>
                    <div style={styles.statDivider} />
                    <div style={styles.statBox}>
                      <div style={styles.statLabel}>Swaps</div>
                      <div style={{ ...styles.statVal, color: col.text }}>{data.swaps}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <div style={styles.sectionTitle}>▦ Performance Graph</div>
                <div style={styles.sectionSub}>Visual comparison of comparisons and swaps</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={graphData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
                <YAxis tick={{ fontSize: 12, fill: "#888" }} label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 12, fill: "#aaa" } }} />
                <Tooltip
                  contentStyle={{ border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 13 }}
                  cursor={{ fill: "#f5f5f5" }}
                />
                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
                <Bar dataKey="comparisons" fill="#334155" radius={[3, 3, 0, 0]} label={{ position: "top", fontSize: 11, fill: "#555" }} />
                <Bar dataKey="swaps" fill="#94A3B8" radius={[3, 3, 0, 0]} label={{ position: "top", fontSize: 11, fill: "#555" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.footer}>
            💡 Lower values are better. Compare algorithms based on fewer comparisons and swaps.
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  root: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 24px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#1a1a1a",
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  controlBar: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 28,
    flexWrap: "wrap",
  },
  controlSection: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
    minWidth: 180,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    padding: "9px 12px",
    border: "0.5px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    color: "#1a1a1a",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  inputHint: {
    fontSize: 11,
    color: "#bbb",
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 20,
    border: "0.5px solid",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  actionsCol: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 120,
  },
  btnRun: {
    padding: "9px 20px",
    background: "#3C3489",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  btnReset: {
    padding: "9px 20px",
    background: "#fff",
    color: "#555",
    border: "0.5px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sectionIcon: {
    fontSize: 20,
    color: "#3C3489",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  sectionSub: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", 
  gap: 20,
  marginBottom: 24,
},
  resultCard: {
    background: "#fff",
    border: "1px solid",
    borderRadius: 12,
    padding: "16px 18px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  cardSub: {
    fontSize: 11,
    color: "#aaa",
  },
  sortedBox: {
    background: "#f7f7f7",
    borderRadius: 7,
    padding: "7px 10px",
    fontSize: 12,
    color: "#555",
    fontFamily: "monospace",
    marginBottom: 12,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    textAlign: "center",
    padding: "4px 0",
  },
  statDivider: {
    width: "0.5px",
    height: 36,
    background: "#eee",
  },
  statLabel: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 2,
  },
  statVal: {
    fontSize: 22,
    fontWeight: 700,
  },
  chartCard: {
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
  },
  chartHeader: {
    marginBottom: 12,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
    paddingBottom: 16,
  },
};

export default App;