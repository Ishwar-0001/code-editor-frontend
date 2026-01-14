export const questionData = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  description: "Given an array of integers **nums** and an integer **target**, return indices of the two numbers such that they add up to **target**.",
  examples: [
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      id: 3,
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: "The sum of 3 and 3 is 6. Note that we return indices, not values."
    }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "Only one valid answer exists."
  ],
  hints: [
    "Try using a hash map to store the index of the complement.",
    "The complement is target - nums[i]."
  ],
  starterCode: "function twoSum(nums, target) {\n  // Write your code here\n};"
};