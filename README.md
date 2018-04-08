# vesta

**[Vesta Rayan Afzar](http://vestarayanafzar.com) Admin Panel Code Boilerplate**

**Attention:** 
Do NOT clone this repository directly, use [vesta](https://github.com/VestaRayanAfzar/vesta) to create your project

`vesta create projectName --type=admin`

use `vesta create --help` for more information

### Development
Change `api` value to your api server address from `src/client/app/config/variantConfig.ts`.
Also modify the common Configurations from `src/client/app/cmn/config/cmnConfig.ts`.

This project has only `web` target. 
For more information about targets, please visit [vesta-template-client](https://github.com/VestaRayanAfzar/vesta-template-client)

Run `npm run dev:web`, in order to launch the application.

You can use [vesta](https://github.com/VestaRayanAfzar/vesta) code generator to create new models and components.
Use `vesta gen --help` for more information.

#### Target based development
In order to use a section of code for specific target you can wrap that section like this:

```
//<targetName>
your targetName specific code goes here...
//</targetName>
```

Valid targets are:
- `web`
- `development`
- `production`

for example if you want to target `production`, you may wrap that section in `production` wrapper:

```
//<production>
your production specific code goes here...
//</production>
```

All these code eliminations occur at build time using `resources/gulp/plugins/eliminator` gulp plugin.

### Production
Production mode configuration file is located at `resources/gitignore/variantConfig.ts`.
There is a bash script in `resources/ci/deploy.sh` (change it to cover your needs).

On target system (production) you have to install [vesta](https://github.com/VestaRayanAfzar/vesta) platform. Then run `vesta deploy [https://git/repo.git]`.

Current deploy script is set to serve client files statically using nginx.
   