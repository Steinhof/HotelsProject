import cases from 'jest-in-case';

describe('[UNIT] ReadImage', () => {
    cases(
        'Cases title',
        (opts: any) => {
            expect(opts.id).toBe(1);
        },
        [{ id: 1 }, { id: 1 }, { id: 1 }],
    );
});
