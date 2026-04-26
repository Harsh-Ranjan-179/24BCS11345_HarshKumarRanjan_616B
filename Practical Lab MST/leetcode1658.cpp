class Solution {
public:
    int minOperations(vector<int>& nums, int x) {
        int n = nums.size();
        int ans = INT_MAX;
        for(int i=0; i<=n;i++) {
            int leftSum=0;
            for(int l = 0; l < i; l++)
                leftSum += nums[l];
            int rightSum = 0;
            for(int j = 0; j <= n - i; j++) {
                if(leftSum + rightSum == x)
                    ans = min(ans, i + j);
                if(j < n - i)
                    rightSum += nums[n - 1 - j];
            }
        }
        if(ans == INT_MAX) return -1;
        return ans;
    }
};