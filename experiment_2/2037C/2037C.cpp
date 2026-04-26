#include <iostream>
#include <vector>

using namespace std;

void solve() {
    int n;
    cin >> n;
    if (n < 5) {
        cout << -1 << endl;
        return;
    }
    for (int i = 1; i <= n; i += 2) {
        if (i != 5) cout << i << " ";
    }
    cout << 5 << " " << 4 << " ";
    for (int i = 2; i <= n; i += 2) {
        if (i != 4) cout << i << " ";
    }
    cout << endl;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}