erDiagram
    %% ─────────────────────────────────────────────────────────────
    %%  PHYSICAL FILES & LOCAL STORAGE
    %% ─────────────────────────────────────────────────────────────
    RAW_FILE ||--o{ PROCESSED_FILE    : "cleaned/converted"
    PROCESSED_FILE ||--|| ENCRYPTED_FILE : "AES‑256 cipher"
    ENCRYPTED_FILE ||--|| KEY_FILE       : "RSA‑encrypted AES key"
    ENCRYPTED_FILE ||--|| META_FILE      : "cipher metadata (.meta)"

    RAW_FILE {
        string  file_name     PK
        string  original_ext          "xlsx / csv / json"
        int     size_bytes
        string  uploader_addr FK
        datetime created_at
    }
    PROCESSED_FILE {
        string  file_name     PK
        string  format                "json / csv"
        int     rows
        int     cols
        datetime processed_at
    }
    ENCRYPTED_FILE {
        string  file_name     PK        ".enc"
        string  sha256_hash
        datetime encrypted_at
    }
    KEY_FILE {
        string  file_name     PK        ".key"
        string  rsa_key_fingerprint
    }
    META_FILE {
        string  file_name     PK        ".meta"
        string  iv_hex
        string  cipher_mode           "CBC"
        int     key_length_bits
    }

    %% ─────────────────────────────────────────────────────────────
    %%  BLOCKCHAIN LAYER
    %% ─────────────────────────────────────────────────────────────
    CHAIN_RECORD ||--|| ENCRYPTED_FILE : "references (hashes)"
    ETH_ACCOUNT ||--o{ CHAIN_RECORD    : "owns"
    ETH_ACCOUNT ||--o{ ACCESS_GRANT    : "has / gives"

    ETH_ACCOUNT {
        address  eth_address PK
        string   label                     "owner, grantee…"
    }
    CHAIN_RECORD {
        string   data_id     PK            "keccak256(id)"
        address  owner_addr  FK
        string   cipher_hash
        string   meta_hash
        uint     block_number
        datetime timestamp
    }
    ACCESS_GRANT {
        address  eth_address FK
        string   data_id     FK
        datetime granted_at
        bool     active
    }
