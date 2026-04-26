class Solution {
public:
    int numSubarrayBoundedMax(vector<int>& nums, int left, int right) {
        int n = nums.size();
        int cnt = 0;
        for(int i=0;i<n;i++) {
            int mx=nums[i];
            for(int j=i;j<n;j++) {
                mx = max(mx, nums[j]);
                if(mx>=left && mx<=right){
                    cnt++;
                }
            }
        }
        return cnt;
    }
};