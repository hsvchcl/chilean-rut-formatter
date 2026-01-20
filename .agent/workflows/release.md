---
description: Cómo publicar una nueva versión del paquete a npm
---

# Release Workflow

Este proyecto usa GitHub Actions para publicar automáticamente a npm cuando se crea un tag.

## Pasos para hacer un release

// turbo-all

1. Asegúrate de estar en la rama `main` con los últimos cambios:
```bash
git checkout main
git pull origin main
```

2. Haz tus cambios y commitea:
```bash
git add .
git commit -m "feat: descripción del cambio"
```

3. Crea la nueva versión (esto crea commit + tag automáticamente):
```bash
# Para patch (1.0.0 → 1.0.1):
npm version patch

# Para minor (1.0.0 → 1.1.0):
npm version minor

# Para major (1.0.0 → 2.0.0):
npm version major
```

4. Push a main con los tags (esto dispara el GitHub Action):
```bash
git push origin main --tags
```

5. Sincroniza develop con main:
```bash
git checkout develop
git merge main
git push origin develop
git checkout main
```

## ⚠️ Importante

- **NO ejecutes `npm publish` manualmente** - el GitHub Action se encarga de eso
- El Action se dispara automáticamente cuando se hace push de un tag `v*`
- Si publicas manualmente, el Action fallará con error 403 porque la versión ya existe

## 🔄 OBLIGATORIO: Sincronización de Ramas

> [!CAUTION]
> **NUNCA olvides sincronizar `main` y `develop` después de cada release.**
> Ambas ramas SIEMPRE deben estar en el mismo commit después de un release.

Después de cada release, SIEMPRE ejecuta:
```bash
# Si estás en main, sincroniza develop:
git checkout develop
git merge main
git push origin develop

# Si estás en develop, sincroniza main:
git checkout main
git merge develop
git push origin main
```

Verifica que estén sincronizadas:
```bash
git log --oneline -1 main && git log --oneline -1 develop
# Ambas deben mostrar el mismo commit hash
```

## Verificación

Después del push, verifica en:
- [GitHub Actions](https://github.com/hsvchcl/chilean-rut-formatter/actions) - que el workflow complete exitosamente
- [npm](https://www.npmjs.com/package/chilean-rut-formatter) - que la versión aparezca publicada
