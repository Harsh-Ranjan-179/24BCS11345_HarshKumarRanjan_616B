#include <iostream>
#include <vector>
#include <string>

using namespace std;

string solve() {
    int n;
    string s;
    cin >> n >> s;
    if (n == 1) return s;
    vector<int> count(26, 0);
    for (char c : s) {
        count[c - 'a']++;
    }
    int maxcnt = -1;
    char maxch = ' ';
    for (int i = 0; i < 26; i++) {
        if (count[i] >= maxcnt) {
            maxcnt = count[i];
            maxch = (char)('a' + i);
        }
    }
    int mincnt = 1e9;
    char minch = ' ';
    for (int i = 0; i < 26; i++) {
        if (count[i] > 0 && count[i] <= mincnt) {
            if ((char)('a' + i) != maxch) {
                mincnt = count[i];
                minch = (char)('a' + i);
            }
        }
    }
    if (minch == ' ') {
        return s;
    }
    for (int i = 0; i < n; i++) {
        if (s[i] == minch) {
            s[i] = maxch;
            break;
        }
    }
    return s;
}

int main() {
    int t;
    cin >> t;
    while (t--) {
        cout << solve() << endl;
    }
    return 0;
}