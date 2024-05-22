{
  description = "opendata.fit development environment for the webapp and frontend packages";

  # Use the unstable nixpkgs to use the latest set of node packages
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          # Set the major version of Node.js
          pkgs.nodejs-18_x
          pkgs.yarn
          pkgs.nodePackages.typescript
          # pkgs.nodePackages.typescript-language-server

          # dependencies for grip markdown viewer
          pkgs.python310
          pkgs.python310.pkgs.grip
        ];
      };
    });
}
