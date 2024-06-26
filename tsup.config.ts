import { Options, defineConfig } from 'tsup';

const options: Options = {
    format: ['cjs', 'esm'], // Update format to an array of 'cjs' and 'esm'
    dts: true,
}

const config = defineConfig([
    {
        clean: true,
        name: "cloneOrCreate",
        entry: ['src/index.tsx', 'src/tiny.tsx'], // Add 'src/tiny.tsx' as a secondary entrypoint
        format: ['cjs', 'esm'],
        dts: true,
        skipNodeModulesBundle: true,
    }
]);

export default config;
