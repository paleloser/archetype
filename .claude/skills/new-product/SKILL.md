---
name: new-product
description: Scaffold a new product repository from this archetype — server, webapp, web and the .claude agents and skills — renamed to the product's name, Java package and domain, then hand over to /product-setup. Runs manually, from a checkout of the archetype.
argument-hint: "<target directory> [name=<Name>] [slug=<slug>] [package=<java.package>] [domain=<domain>] [apps=server,webapp,web]"
---

Create a new product from the archetype. Arguments: `$ARGUMENTS`.

## 1. Pin down the inputs

The scaffolding is done by [`scripts/new-product.sh`](../../../scripts/new-product.sh). It needs:

| Input | Example | Used for |
| --- | --- | --- |
| Target directory | `../tandem` | Where the new repository is created. Must not exist, or be empty. |
| Name | `Tandem` | Display name, in prose and titles. |
| Slug | `tandem` | Lowercase identifier: npm package names, Maven `groupId` suffix, config prefix (`tandem.datasource`), database name. `[a-z][a-z0-9]*`. |
| Java package | `io.tandem` | Base package; the server code moves to `<package>.server`. |
| Domain | `tandem.app` | `https://<domain>`, `https://app.<domain>`, `https://api.<domain>`, `hello@<domain>`. |
| Apps | `server,webapp,web` | Which archetypes to include. `.claude/`, the root docs and CI always come along. |

Infer what you can from the arguments (a slug from the name, a package from the domain reversed),
then confirm everything with the maintainer in **one** message before running anything.

## 2. Scaffold

```sh
scripts/new-product.sh --target <dir> --name <Name> --slug <slug> --package <package> \
  --domain <domain> --apps <apps>
```

The script copies the archetype (without `.git`, build output or dependencies), renames the
placeholder identity (`acme`, `Acme`, `com.acme`, `acme.example`), moves the Java sources to the
new package, and runs `git init` with a first commit. Read its output: it lists what it changed and
anything it couldn't.

## 3. Verify

Run, in the new repository, the build of every app it includes, exactly as CI would:

```sh
(cd server && mvn verify)                      # needs Docker for the Testcontainers ITs; -DskipITs otherwise
(cd webapp && npm install && npm run lint && npm run build)
(cd web && npm install && npm run lint && npm run build)
```

A failure here is a bug in the archetype or the script: report it with the output, and fix it in
the archetype too, not only in the new repository.

## 4. Hand over

Tell the maintainer where the repository is, that it has no remote yet (create the GitHub
repository, then `git remote add origin ... && git push -u origin main`, and create the trunk
branch), and that the next step is `/product-setup` from inside it: until it runs, every agent
and skill will stop to ask about the product.
