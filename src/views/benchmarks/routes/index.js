import Benchmarks from '@/views/benchmarks/Benchmarks.vue'
import Benchmark from '@/views/benchmarks/Benchmark.vue'

export default [
  {
    path: "/:organization/benchmarks",
    name: "benchmarks",
    component: Benchmarks,
  },
  {
    path: "/:organization/benchmarks/:benchmark",
    name: "benchmark",
    component: Benchmark,
  },
]
