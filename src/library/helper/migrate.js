class Migrate {
  update(fromVersion, toVersion, root) {
    for (let i = fromVersion; toVersion > i; i++) {
      const func = 'migrate_v'.concat(i, '_to_v')
        .concat(i + 1);
      if (this[func]) {
        this[func](root);
      }
    }
  }

  migrate_v0_to_v1(root) {
    const table = root.find('[data-section-key="table"]');
    table.before('<p>');
    table.after('<p>');
  }
}

export default Migrate;
