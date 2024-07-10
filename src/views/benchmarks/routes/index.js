import Benchmarks from '@/views/benchmarks/Benchmarks.vue'
import Benchmark from '@/views/benchmarks/Benchmark.vue'

export default [
  {
    path: "/benchmarks",
    name: "benchmarks",
    component: Benchmarks,
  },
  {
    path: "/benchmarks/:benchmark",
    name: "benchmark",
    component: Benchmark,
  },
]
