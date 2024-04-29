import { Options, defineConfig } from 'tsup';

const options: Options = {
    format: ['cjs', 'esm'], // Update format to an array of 'cjs' and 'esm'
    dts: true,
}

const config = defineConfig([
    {
        name: "cloneOrCreate",
        entry: ['src/index.tsx', 'src/tiny.tsx'], // Add 'src/tiny.tsx' as a secondary entrypoint
        ...options
    }
]);

export default config;
